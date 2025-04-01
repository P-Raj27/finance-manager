# Finance Manager

A serverless application for managing and tracking investment records with automated summarization capabilities.

## Overview

Finance Manager is a serverless application built on AWS Lambda that provides comprehensive investment tracking and analysis capabilities. The application offers CRUD operations for managing investment records and features automated daily summarization of investment portfolios.

## Features

- **Investment Record Management**
  - Create new investment records
  - Retrieve existing investments
  - Update investment details
  - Delete investment records

- **Automated Summarization**
  - Daily portfolio summary generation
  - Investment-wise profit/loss tracking
  - Overall portfolio performance analysis

- **Real-time Calculations**
  - Automatic profit/loss calculation
  - Investment-wise returns tracking
  - Total portfolio value computation

## API Examples
This section provides examples of API calls for the Finance Manager application.

### 1. Create Investment Record
```http
POST /create
Content-Type: application/json

{
  "isRecurring": true,
  "recurringAmount": 5000,
  "investmentType": "Mutual_Fund",
  "investmentName": "SBI Bluechip Fund",
  "investmentAmount": 980000,
  "returnsAmount": 630000,
  "appName": "Groww",
  "email": "investor@example.com",
  "maturityDate": "2026-12-31"
}
```

### 2. Read Investment Record
```http
POST /read
Content-Type: application/json

{
  "email": "investor@example.com",
  "investmentType": "Mutual_Fund",
  "investmentName": "SBI Bluechip Fund"
}
```

### 3. Update Investment Record
```http
PUT /update
Content-Type: application/json

{
  "email": "investor@example.com",
  "investmentType": "Mutual_Fund",
  "investmentName": "Axis Bluechip Fund",
  "returnsAmount": 32000,
  "investmentAmount": 45000
}
```

### 4. Delete Investment Record
```http
DELETE /delete
Content-Type: application/json

{
  "email": "investor@example.com",
  "investmentType": "Mutual_Fund",
  "investmentName": "SBI Bluechip Fund"
}
```


## Technical Architecture

### Core Components

- **AWS Lambda Functions**
  - CRUD Operations handlers
  - Automated summarizer
  - Response handling middleware

- **Data Storage**
  - DynamoDB with composite keys (pk, sk)
  - Pay-per-request billing mode
  - Optimized for query performance

- **API Endpoints**
  ```
  POST   /create    - Create new investment record
  POST   /read      - Retrieve investment details
  PUT    /update    - Update existing investment
  DELETE /delete    - Remove investment record
  ```

### Data Models

#### Investment Record
```typescript
{
  pk: string;           // Partition key (format: finance#email)
  sk: string;           // Sort key (format: investmentType#investmentName)
  investmentAmount: number;
  returnsAmount: number;
  investmentType: string;
  totalProfit: number;
  isProfit: boolean;
  appName: string;
  email: string;
  isRecurring: boolean;
  maturityDate: string;
  recurringAmount: number;
  totalProfit: number;

}
```

#### Summary Record
```typescript
{
  pk: string;           // Partition key (format: financeSummary#email)
  sk: string;           // Sort key (format: investmentType)
  totalInvestment: number;
  totalReturns: number;
  totalProfit: number;
  isProfit: boolean;
}
```

## API Reference

### Create Investment Record
```http
POST /create
Content-Type: application/json

{
  "email": "user@example.com",
  "investmentType": "STOCKS",
  "investmentName": "AAPL",
  "investmentAmount": 1000,
  "returnsAmount": 1200
}
```

### Read Investment Record
```http
POST /read
Content-Type: application/json

{
  "email": "user@example.com",
  "investmentType": "STOCKS",
  "investmentName": "AAPL"
}
```

### Update Investment Record
```http
PUT /update
Content-Type: application/json

{
  "email": "user@example.com",
  "investmentType": "STOCKS",
  "investmentName": "AAPL",
  "investmentAmount": 1500,
  "returnsAmount": 1800
}
```

### Delete Investment Record
```http
DELETE /delete
Content-Type: application/json

{
  "email": "user@example.com",
  "investmentType": "STOCKS",
  "investmentName": "AAPL"
}
```

## Response Format

All API endpoints return responses in the following format:

```typescript
{
  statusCode: number;
  body: {
    statusCode: number;
    generatedAt: number;
    data?: any[];
    error?: any[];
    message: string;
  }
}
```

### Status Codes

- 200: Successful operation
- 201: Resource created
- 400: Bad request
- 403: Access denied
- 404: Resource not found
- 409: Resource conflict
- 500: Internal server error
- 503: External service unavailable

## Automated Summarization

The application includes an automated summarization function that runs daily at 5:00 AM UTC. This function:

1. Aggregates all investment records for each user
2. Calculates total investment and returns
3. Generates investment-wise summaries
4. Updates summary records in DynamoDB

## Error Handling

The application implements comprehensive error handling with:

- Input validation using Zod schemas
- Standardized error responses
- Detailed error messages
- Error logging for debugging

## Security

- AWS IAM role-based access control
- DynamoDB table-level permissions
- API endpoint CORS configuration
- Environment-based configuration management

## Development

The project uses TypeScript with the following development tools:

- Jest for unit testing
- ESBuild for bundling
- Serverless Framework for deployment
- GitHub Actions for CI/CD