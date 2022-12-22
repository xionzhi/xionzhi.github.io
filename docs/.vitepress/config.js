module.exports = {
  base: '/',
  title: 'Xionzhi Github Io',
  description: '',

  themeConfig: {
    logo: "/logo.png",
    siteTitle: "",
    // Navbar Link
    nav: [
      { text: "Home", link: "/" },
      { text: "Contact", link: "/contact" },
      { text: "Guide", link: "/guide" },
      { text: "About", link: "/about" },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/xionzhi/xionzhi.github.io" },
    ],
    // Footer
    footer: {
      message: "Power by Vitepress",
      copyright: "Copyright © 2022 Xionzhi",
    },
    docFooter: {
      prev: 'Newer Posts',
      next: 'Older Posts'
    },
    markdown: {
      theme: "material-palenight",
      lineNumbers: true,
    },
  },
}