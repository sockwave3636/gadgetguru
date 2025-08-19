# Gadget Guru

An AI-powered gadget recommendation system that helps users find the perfect electronic device based on their preferences and requirements.

## Features

- **Smart Recommendations**: AI-powered recommendation engine that matches gadgets to user preferences
- **Multi-Category Support**: Supports 8 gadget categories:
  - Smartphone
  - Laptop
  - Headphones
  - Smartwatch
  - Tablet
  - Camera
  - Charger & Cables
  - Other

- **Personalized Matching**: Considers:
  - Budget range
  - Intended purpose (gaming, photography, work, etc.)
  - Feature priorities
  - Brand preferences
  - Specific requirements

- **Intelligent Scoring**: Advanced algorithm that evaluates:
  - Price compatibility
  - Feature matches
  - Purpose alignment
  - Brand preferences
  - Performance scores

- **Beautiful UI**: Modern, responsive interface built with Next.js and shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. The Firebase configuration is already set up in `src/lib/firebase.ts`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

### 1. User Input
Users provide their preferences through an intuitive form:
- **Category**: What type of gadget they're looking for
- **Budget**: Price range they're comfortable with
- **Purpose**: How they plan to use the device
- **Priorities**: Most important features (battery, camera, storage, etc.)
- **Brand Preferences**: Preferred manufacturers
- **Specific Features**: Any particular requirements

### 2. Recommendation Engine
The AI engine processes user preferences and:
- Filters gadgets by category and budget
- Scores each gadget based on multiple criteria
- Calculates match percentages
- Provides reasoning for recommendations

### 3. Results
Users receive:
- Ranked list of recommended gadgets
- Match percentages for each recommendation
- Detailed reasoning for why each gadget was recommended
- Product images, prices, and specifications

## Recommendation Algorithm

The recommendation engine uses a weighted scoring system:

- **Price Score (30%)**: How well the price fits the budget
- **Feature Match Score (30%)**: Alignment with user priorities
- **Purpose Score (20%)**: Suitability for intended use
- **Brand Score (20%)**: Brand preference matching

### Scoring Factors

#### Price Scoring
- Higher scores for prices closer to budget midpoint
- Considers budget range flexibility

#### Feature Matching
- Checks specifications against user priorities
- Category-specific feature evaluation
- Performance score consideration (Geekbench, Antutu, etc.)

#### Purpose Alignment
- **Gaming**: Graphics cards, high RAM, gaming processors
- **Photography**: Camera quality, sensor size, storage
- **Work**: Processor power, RAM, professional features
- **Entertainment**: Display quality, storage, audio
- **Fitness**: Health monitoring, GPS, durability
- **Music**: Audio quality, driver size, frequency response

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   └── page.tsx           # Main recommendation page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── firebase.ts       # Firebase configuration
│   ├── firebase-utils.ts # Firebase operations
│   └── recommendation-engine.ts # AI recommendation logic
└── types/                # TypeScript type definitions
    └── gadget.ts         # Gadget and preference interfaces
```

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Firebase Firestore
- **AI Engine**: Custom recommendation algorithm

## API Integration

The application integrates with the Gadget Admin Dashboard's Firebase database to fetch gadget data and provide real-time recommendations.

## Customization

### Adding New Categories
1. Update the `GadgetCategory` type in `types/gadget.ts`
2. Add category-specific scoring logic in `recommendation-engine.ts`
3. Update the UI components to include the new category

### Modifying Scoring Weights
Adjust the weight percentages in the `calculateScore` method of the `RecommendationEngine` class.

### Adding New Features
1. Update the `GadgetSpecifications` interface
2. Add feature scoring logic in the recommendation engine
3. Update the UI to include new feature options

## Deployment

The application can be deployed to Vercel, Netlify, or any other hosting platform that supports Next.js.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
