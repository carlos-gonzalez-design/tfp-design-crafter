export function createDefaultFoundations() {
  return {
    colors: {
      primary: '#4353FF',
      background: '#F7F7F8',
      surface: '#FFFFFF',
      text: '#18181B',
      success: '#16794A',
      warning: '#8A5A00',
      error: '#C83A3A',
      info: '#2563EB',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      baseSize: 16,
      scaleRatio: 1.25,
      semanticStyles: {
        h1: { size: '3xl', weight: '700' },
        h2: { size: '2xl', weight: '700' },
        h3: { size: 'xl', weight: '600' },
        bodyLarge: { size: 'lg', weight: '400' },
        body: { size: 'base', weight: '400' },
        small: { size: 'sm', weight: '400' },
        caption: { size: 'xs', weight: '400' },
      },
    },
    spacing: { density: 'default' },
    radius: { button: 'rounded', card: 'rounded', input: 'subtle' },
  }
}

export function createDefaultDesignSystem() {
  return {
    name: 'Demo Design System',
    description: 'A flexible visual language built from connected color, type, spacing and radius foundations.',
  }
}
