# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Structured logger module (`src/lib/logger.ts`) with standard log format and trace IDs
- Partner domain types (`src/types/partner.ts`) with database row types and service response types
- Partner service module (`src/services/partnerService.ts`) with type-safe database operations
- Unit tests for partner scoring engine (`src/__tests__/partnerScoring.test.ts`)
- PROJECT_NOTES.md for running decisions and implementation notes

### Changed
- Standardized async function return shape to `{ data, error, success }`

### Fixed
- Type safety improvements for partner-related database operations

## [0.1.0] - 2024-12-09

### Added
- Initial partner assessment flow
- Cognitive risk scoring engine
- Portfolio visualization with heatmaps
- Partner intake form
- Portfolio scoring table
- Co-delivery plan generation
- Share link functionality
