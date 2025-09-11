# RUMI Design Template Guide

## Overview
The Design Template page (`/dashboard/design-template`) is a comprehensive style guide and component library for the RUMI application. It's accessible only to admin users and serves as a reference for consistent UI design across the application.

## Access
- **URL**: `http://localhost:3000/dashboard/design-template`
- **Access Level**: Admin only
- **Navigation**: Available in the dashboard sidebar for admin users

## What's Included

### 🎨 **Color Palette**
- Primary colors (Blue, Green, Red, Yellow, Gray)
- Complete gray scale (50-900)
- Hex codes and Tailwind CSS classes
- Copy-to-clipboard functionality

### 📝 **Typography**
- Heading styles (H1-H5)
- Body text variations
- Font weights and sizes
- Tailwind CSS classes for each style

### 🔘 **Buttons**
- Primary buttons (various sizes)
- Secondary buttons
- Danger buttons
- Icon buttons
- Disabled states
- Hover effects

### 📋 **Form Elements**
- Text inputs
- Email inputs
- Select dropdowns
- Textareas
- Checkboxes
- Date inputs
- Form validation examples
- Error states

### 📊 **Tables**
- Standard table layout
- Header styling
- Row hover effects
- Status badges
- Action buttons

### 🃏 **Cards**
- Basic cards
- Stats cards
- Feature cards with gradients
- Hover effects

### 🔔 **Modals**
- Standard modal structure
- Header, body, footer sections
- Backdrop overlay
- Close functionality

### ⚠️ **Alerts**
- Success alerts (green)
- Error alerts (red)
- Warning alerts (yellow)
- Info alerts (blue)
- Auto-dismiss functionality

## How to Use

### For Developers
1. **Access the page**: Login as admin and navigate to "Design Template" in the sidebar
2. **Browse components**: Use the navigation tabs to jump to specific sections
3. **Copy classes**: Click "Copy Class" buttons to get Tailwind CSS classes
4. **Reference examples**: Use the live examples as templates for new components

### For Designers
1. **Color consistency**: Use the defined color palette for all designs
2. **Typography scale**: Follow the established heading and text sizes
3. **Component patterns**: Reference the card, button, and form patterns
4. **Spacing**: Follow the consistent padding and margin patterns shown

### Code Examples

#### Basic Button
```html
<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Primary Button
</button>
```

#### Form Input
```html
<input
  type="text"
  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="Enter text">
```

#### Card Component
```html
<div class="bg-white rounded-lg shadow border p-6">
  <h3 class="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
  <p class="text-gray-600 mb-4">Card content goes here.</p>
  <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Action</button>
</div>
```

#### Alert Component
```html
<div class="p-4 rounded-lg border-l-4 bg-green-50 border-green-400 text-green-700">
  <span>Success message here</span>
</div>
```

## Design Principles

### 🎯 **Consistency**
- Use the same color palette throughout the app
- Follow the established typography scale
- Maintain consistent spacing and sizing

### 🔍 **Accessibility**
- All components include proper focus states
- Color contrast meets WCAG guidelines
- Semantic HTML structure

### 📱 **Responsiveness**
- All components are mobile-friendly
- Flexible layouts using Tailwind CSS
- Touch-friendly button sizes

### ⚡ **Performance**
- Lightweight CSS using Tailwind utilities
- Optimized for fast loading
- Minimal custom CSS

## File Structure
```
src/app/pages/dashboard/design-template/
├── design-template.component.ts    # Component logic
├── design-template.component.html  # Template with all examples
└── design-template.component.css   # Custom styles and animations
```

## Future Enhancements
- [ ] Add more component examples (tabs, accordions, etc.)
- [ ] Include animation examples
- [ ] Add dark mode variations
- [ ] Include accessibility testing tools
- [ ] Add component usage statistics

## Contributing
When adding new components to the RUMI application:
1. Follow the patterns established in this design template
2. Add new component examples to the template page
3. Update this documentation
4. Ensure consistency with existing designs

---

**Note**: This design template is a living document and should be updated whenever new UI patterns are established in the application.
