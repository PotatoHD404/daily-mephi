import '../styles/globals.css'


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  nextRouter: {
    query: {
      foo: 'this-is-a-global-override'
    }
  }
}
