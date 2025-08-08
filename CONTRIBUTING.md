# Contributing to PersonaFlux

We love your input! We want to make contributing to PersonaFlux as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## 🐛 Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/GIT-Pushers/PersonaFlux/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## 🔧 Development Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Git
- Supabase account
- Google AI Studio API key

### Local Development

1. **Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/PersonaFlux.git
cd PersonaFlux
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Fill in your environment variables
```

4. **Start development server**
```bash
npm run dev
```

### 📁 Project Structure

```
src/
├── app/                 # Next.js 13+ app router
│   ├── (auth)/         # Authentication pages
│   ├── (dashboard)/    # Dashboard pages
│   ├── (game)/         # Game-related pages
│   ├── (website)/      # Marketing pages
│   └── api/            # API routes
├── components/         # Reusable UI components
│   └── ui/            # Shadcn/ui components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
├── service/           # API service functions
├── store/             # State management
└── utils/             # Helper utilities
```

## 🎨 Code Style

### TypeScript

We use TypeScript for type safety. Please ensure your code:

- Has proper type annotations
- Follows existing patterns
- Uses interfaces for object shapes
- Exports types when they're shared

### React Components

```typescript
/**
 * Component description
 * @param props - Component props
 * @returns JSX element
 */
interface ComponentProps {
  title: string;
  isVisible?: boolean;
}

export const Component: React.FC<ComponentProps> = ({ 
  title, 
  isVisible = true 
}) => {
  // Component logic here
  return (
    <div className="component-container">
      {isVisible && <h1>{title}</h1>}
    </div>
  );
};
```

### API Routes

```typescript
/**
 * API route handler description
 * @param req - Next.js request object
 * @returns Response with appropriate status and data
 */
export async function POST(req: NextRequest) {
  try {
    // Validate input
    const body = await req.json();
    
    // Process request
    const result = await processData(body);
    
    // Return response
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Adding Tests

When adding new features, please include appropriate tests:

```typescript
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders title correctly', () => {
    render(<Component title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

## 📝 Documentation

### Code Comments

- Use JSDoc for functions and components
- Explain complex business logic
- Document API endpoints and their parameters

### README Updates

When adding significant features:

1. Update the main README.md
2. Add API documentation examples
3. Update the feature list

## 🏷 Commit Messages

We follow conventional commits:

```
feat: add character voice selection
fix: resolve authentication redirect loop
docs: update API documentation
style: format code with prettier
refactor: simplify character generation logic
test: add unit tests for character service
chore: update dependencies
```

## 🚦 Pull Request Process

1. **Branch Naming**: Use descriptive names like `feature/character-voice-selection` or `fix/auth-redirect-loop`

2. **PR Title**: Follow conventional commit format

3. **PR Description**: Include:
   - What changes were made
   - Why the changes were necessary
   - Any breaking changes
   - Screenshots/GIFs for UI changes

4. **Review Process**:
   - At least one maintainer review required
   - All CI checks must pass
   - No merge conflicts

## 🌟 Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists
2. Open an issue with the `enhancement` label
3. Provide detailed description and use cases
4. Include mockups or examples if applicable

## 📋 Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## 🤝 Community Guidelines

### Be Respectful

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Be Helpful

- Help newcomers get started
- Share knowledge and best practices
- Provide constructive feedback
- Collaborate effectively

## 📞 Getting Help

- **Discord**: Join our [Discord server](https://discord.gg/personaflux)
- **GitHub Issues**: [Open an issue](https://github.com/GIT-Pushers/PersonaFlux/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/GIT-Pushers/PersonaFlux/discussions)

## 🏆 Recognition

Contributors who make significant contributions will be:

- Added to the README contributors section
- Credited in release notes
- Invited to join the core team (for exceptional contributors)

Thank you for contributing to PersonaFlux! 🚀
