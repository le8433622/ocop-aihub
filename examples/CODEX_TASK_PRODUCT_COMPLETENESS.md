# Task: Add Product Completeness Score

## Priority

P1

## Area

Products

## Context

Supplier products often miss required OCOP commerce fields, causing admin rejection and slow onboarding.

## Problem

Products without shelf life, origin, images, inventory, and certificate data are harder to approve and sell.

## Goal

Add product completeness scoring from 0 to 100.

## Scope

Allowed:

- lib/products/**
- app/api/products/**
- components/products/**
- tests/products/**

Blocked:

- lib/payments/**
- lib/shipping/**
- lib/orders/**

## Requirements

- Add scoring function in `lib/products/completeness.ts`.
- Score should consider name, description, images, origin, OCOP stars, shelf life, ingredients, inventory, weight, price.
- Return missing fields list.
- Add API `GET /api/products/[id]/completeness`.
- Add `ProductCompletenessCard` component.
- Do not auto-approve product.

## Acceptance Criteria

- Score returns 0-100.
- Missing fields are listed.
- Supplier can see warning if score below 70.
- Tests cover low, medium, high completeness.
- No payment/order logic changed.

## Commands

- npm run typecheck
- npm test
