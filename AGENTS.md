# Agent Guidelines for E-commerce Backend

## Project Overview
This is a Next.js 15 e-commerce backend API using TypeScript, Sequelize (PostgreSQL), and Zod for validation. The API follows a layered architecture pattern with controllers, services, models, and schemas.

## Build, Lint, and Test Commands

### Development
```bash
npm run dev              # Start Next.js dev server with Turbopack
npm run build           # Production build with Turbopack
npm run start           # Start production server
npm run lint            # Run ESLint
```

### Running a Single Test
No test framework is currently configured. To add tests, consider using Jest or Vitest.

### Type Checking
```bash
npx tsc --noEmit        # Run TypeScript compiler check
```

## Code Style Guidelines

### File Organization
- API routes live in `app/api/` directory
- Use underscored folders for internal modules: `_controllers`, `_services`, `_models`, `_schemas`, `_helpers`, `_database`
- Controllers handle HTTP request/response logic
- Services contain business logic and database operations
- Models define Sequelize database schemas
- Schemas define Zod validation schemas

### Import Conventions
```typescript
// Relative imports for internal modules
import AuthCodeService from "../_services/authCodeService";
import { Product } from "../_models/products";

// Use @ alias for project root imports
import { UUID } from "@/app/api/_helpers/types";
```

### TypeScript Guidelines
- Enable strict mode in tsconfig.json
- Prefer explicit types over `any` (eslint allows `any` via config)
- Use proper typing for Sequelize models:
```typescript
type UserInstance = InstanceType<typeof User>;
type UserCreationAttributes = CreationAttributes<UserInstance>;
```
- Use `unknown` type for caught errors, then narrow appropriately

### Naming Conventions
- **Files**: kebab-case (e.g., `authCodeService.ts`, `productSchema.ts`)
- **Classes**: PascalCase (e.g., `UserService`, `ProductController`)
- **Functions**: camelCase (e.g., `getProducts`, `sendCodeToEmail`)
- **Constants**: UPPER_SNAKE_CASE for config values, camelCase for others
- **Database models**: PascalCase (e.g., `Product`, `User`)

### Error Handling
- Use try/catch blocks in route handlers
- Return proper HTTP status codes:
  - 200 for successful GET/PUT
  - 201 for successful POST
  - 400 for validation errors
  - 404 for not found
  - 500 for server errors
- Log errors to console with context
```typescript
try {
  const products = await getProducts();
  return NextResponse.json({ products }, { status: 200 });
} catch (error: unknown) {
  console.error("Error in GET /api/products/:", error);
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}
```

### API Response Format
```typescript
// Success
return NextResponse.json({ products }, { status: 200 });

// Error
return NextResponse.json({ error: "Error message" }, { status: 400 });
```

### Database Patterns
- Use Sequelize for ORM
- Define models with DataTypes:
```typescript
export const Product = sequelize.define("Product", {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
});
```
- Services instantiate models and perform CRUD operations

### Validation with Zod
```typescript
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().nonnegative("Price must be positive"),
  stock: z.number().int().nonnegative(),
});
```

### Code Formatting
- Use Prettier for code formatting (add to project if needed)
- 2-space indentation
- Trailing commas in objects and arrays
- Single quotes for strings

### ESLint Configuration
- Uses `next/core-web-vitals` and `next/typescript` configs
- Ignores: node_modules, .next, build directories
- Allows `any` type (@typescript-eslint/no-explicit-any is off)

### Environment Variables
- Store sensitive data in `.env.local` (already in .gitignore)
- Never commit secrets to version control

### Common Patterns

#### Route Handler Pattern
```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const result = await someService.getData();
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Message" }, { status: 500 });
  }
}
```

#### Service Class Pattern
```typescript
export default class UserService {
  constructor() {
    // Initialize connection if needed
  }

  async getUserById(id: UUID): Promise<UserInstance | null> {
    return await User.findByPk(id);
  }
}
```

## Cursor/Copilot Rules
No custom rules found in `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md`.

## Dependencies
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Sequelize ORM
- **Validation**: Zod
- **Auth**: JWT (jsonwebtoken)
- **Email**: Resend
- **Search**: Algolia
- **Styling**: Tailwind CSS 4