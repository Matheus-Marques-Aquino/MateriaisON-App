App.accessRule('*');
App.accessRule('http://materiaison.meteorapp.com/*');
App.appendToConfig(`
  <universal-links>
    <host name="http://materiaison.meteorapp.com:3000" />
  </universal-links>
`);