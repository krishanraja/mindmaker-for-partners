import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Maximum number of logs to process in a single batch
const MAX_BATCH_SIZE = 50;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting batch processing of pending sync logs');

    // Get all pending sync logs with limit to prevent abuse
    const { data: pendingLogs, error: fetchError } = await supabase
      .from('google_sheets_sync_log')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(MAX_BATCH_SIZE);

    if (fetchError) {
      throw new Error(`Failed to fetch pending logs: ${fetchError.message}`);
    }

    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;

    console.log(`Found ${pendingLogs?.length || 0} pending sync logs to process`);

    if (pendingLogs && pendingLogs.length > 0) {
      for (const log of pendingLogs) {
        processedCount++;
        
        try {
          // Validate sync_type before processing
          const validSyncTypes = ['booking', 'analytics', 'lead_scores'];
          const syncType = validSyncTypes.includes(log.sync_type) ? log.sync_type : 'booking';

          // Call the main sync function for each log
          const syncResponse = await fetch(`${supabaseUrl}/functions/v1/sync-to-google-sheets`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: syncType,
              trigger_type: 'batch_processing',
              sync_log_id: log.id,
              data: log.sync_data
            }),
          });

          if (syncResponse.ok) {
            successCount++;
            console.log(`Successfully processed sync log ${(log.id as string).substring(0, 8)}`);
          } else {
            errorCount++;
            const errorText = await syncResponse.text();
            console.error(`Failed to process sync log ${(log.id as string).substring(0, 8)}: HTTP ${syncResponse.status}`);
            
            // Update the log with error status (don't expose full error to log)
            await supabase
              .from('google_sheets_sync_log')
              .update({
                status: 'batch_failed',
                error_message: `HTTP ${syncResponse.status}: Sync failed`,
                last_updated_at: new Date().toISOString(),
                sync_metadata: {
                  ...(log.sync_metadata as Record<string, unknown> || {}),
                  batch_error_at: new Date().toISOString()
                }
              })
              .eq('id', log.id);
          }
        } catch (error: unknown) {
          errorCount++;
          console.error(`Exception processing sync log ${(log.id as string).substring(0, 8)}:`, error);
          
          // Update the log with error status (sanitized message)
          await supabase
            .from('google_sheets_sync_log')
            .update({
              status: 'batch_failed',
              error_message: 'Batch processing failed',
              last_updated_at: new Date().toISOString(),
              sync_metadata: {
                ...(log.sync_metadata as Record<string, unknown> || {}),
                batch_error_at: new Date().toISOString()
              }
            })
            .eq('id', log.id);
        }
      }
    }

    console.log(`Batch processing completed: ${processedCount} processed, ${successCount} success, ${errorCount} errors`);

    return new Response(JSON.stringify({
      success: true,
      processed_count: processedCount,
      success_count: successCount,
      error_count: errorCount,
      message: 'Batch processing completed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in batch processing:', error);
    // Don't expose internal error details
    return new Response(JSON.stringify({
      error: 'Batch processing failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
