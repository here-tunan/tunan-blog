#!/bin/bash

API_BASE="http://localhost:3002/api"

echo "Testing Device App API Endpoints"
echo "================================"

# Test public endpoints
echo -e "\n1. Testing GET /api/device-app/list"
curl -X GET "$API_BASE/device-app/list" -H "Content-Type: application/json" | jq '.'

echo -e "\n2. Testing GET /api/device-app/grouped"
curl -X GET "$API_BASE/device-app/grouped" -H "Content-Type: application/json" | jq '.'

echo -e "\n3. Testing GET /api/device-app/category/Hardware"
curl -X GET "$API_BASE/device-app/category/Hardware" -H "Content-Type: application/json" | jq '.'

echo -e "\n4. Testing GET /api/device-app/category/Software"
curl -X GET "$API_BASE/device-app/category/Software" -H "Content-Type: application/json" | jq '.'

echo -e "\nAPI Testing Complete!"