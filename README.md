# RHCL dev portal feature

A React application for the RHCL developer portal console experience using PatternFly 6, including Kuadrant-style overview and related flows (OpenShift console plugin prototype).

## Git remote (after renaming on GitHub)

GitHub **repository names cannot contain spaces**. Use a URL-safe slug such as **`rhcl-dev-portal-feature`**, then point your local `origin` at the new URL:

```bash
git remote set-url origin git@github.com:Joeyyubo/rhcl-dev-portal-feature.git
```

(Replace `Joeyyubo` / repo slug if yours differ.)

## Features

- **Authentic Layout**: Reproduces the exact layout from the OpenShift console with navigation sidebar and header
- **PatternFly 6 Components**: Uses the latest PatternFly 6 design system components
- **Responsive Design**: Mobile-first responsive layout following PatternFly guidelines
- **Interactive Elements**: Functional search, sorting, and navigation components
- **Gateway Management**: Overview cards and detailed traffic distribution table

## Components

### Main Sections

1. **Navigation & Layout**
   - Left sidebar with collapsible navigation
   - Top masthead with brand, tools, and user menu
   - OpenShift-style navigation structure

2. **Kuadrant Overview**
   - Getting started resource cards
   - Feature highlights
   - Enhancement recommendations

3. **Gateway Metrics**
   - Total Gateways count
   - Healthy Gateways with success indicator
   - Unhealthy Gateways with warning indicator

4. **Gateway Traffic Distribution**
   - Searchable and sortable data table
   - Status indicators and labels
   - Action dropdowns for each gateway

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Design Guidelines

This application follows PatternFly 6 design principles:

- **Consistent spacing**: Uses PatternFly's spacing tokens and grid system
- **Typography**: Follows PatternFly's typography scale and hierarchy
- **Colors**: Uses PatternFly's color palette for status indicators and semantic colors
- **Components**: Leverages PatternFly's pre-built components for consistency
- **Accessibility**: Maintains WCAG 2.1 AA compliance through PatternFly components

## Project Structure

```
src/
├── components/
│   ├── KuadrantOverview.js    # Main overview page
│   ├── GatewayMetrics.js      # Gateway metrics cards
│   └── GatewayTable.js        # Traffic distribution table
├── App.js                     # Main application with layout
└── index.js                   # Application entry point
```

## Technologies Used

- **React 18**: Modern React with hooks
- **PatternFly 6**: Latest version of Red Hat's design system
- **Webpack**: Module bundler and dev server
- **Babel**: JavaScript compiler for modern syntax

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Apache 2.0 