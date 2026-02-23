export const menuItems = [
  {
    path: "/user/dashboard",
    label: "Home",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
    </svg>
  },
  {
    path: "/user/orders",
    label: "Orders",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-inbox" viewBox="0 0 16 16">
      <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z" />
    </svg>
  },
  {
    path: "/user/products",
    label: "My Products",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box" viewBox="0 0 16 16">
      <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z" />
    </svg>
  },
  {
    path: "/user/catalogue",
    label: "Catalogue",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M2 2h4v4H2V2zm0 6h4v4H2V8zm6-6h4v4H8V2zm0 6h4v4H8V8z" />
      </svg>
    ),
  },
  {
    path: "/user/prices",
    label: "Price List",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M3 2v4.586l5.293 5.293a1 1 0 0 0 1.414 0l3.586-3.586a1 1 0 0 0 0-1.414L7.414 1H4a1 1 0 0 0-1 1z" />
        <circle cx="5.5" cy="4.5" r="1" />
      </svg>
    ),
  },
  {
    path: "/user/stores",
    label: "Stores",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M2 2h12l1 4H1l1-4zm1 5h10v7H3V7z" />
      </svg>
    ),
  },

  {
    path: "/user/settings",
    label: "Settings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M9.405 1.05a1 1 0 0 0-2.81 0l-.34 1.093a5.97 5.97 0 0 0-1.43.83L3.79 2.81a1 1 0 0 0-1.415 1.414l.163.163a5.978 5.978 0 0 0-.83 1.43L.616 6.158a1 1 0 0 0 0 2.684l1.093.34c.19.51.47.99.83 1.43l-.163.163a1 1 0 1 0 1.415 1.414l.163-.163c.44.36.92.64 1.43.83l.34 1.093a1 1 0 0 0 2.684 0l.34-1.093c.51-.19.99-.47 1.43-.83l.163.163a1 1 0 0 0 1.414-1.414l-.163-.163c.36-.44.64-.92.83-1.43l1.093-.34a1 1 0 0 0 0-2.684l-1.093-.34a5.978 5.978 0 0 0-.83-1.43l.163-.163A1 1 0 0 0 12.21 2.81l-.163.163a5.97 5.97 0 0 0-1.43-.83L9.405 1.05zM8 10.5A2.5 2.5 0 1 1 8 5.5a2.5 2.5 0 0 1 0 5z" />
      </svg>
    ),
  },

  {
    path: "/user/contact",
    label: "Cantact us",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M9.405 1.05a1 1 0 0 0-2.81 0l-.34 1.093a5.97 5.97 0 0 0-1.43.83L3.79 2.81a1 1 0 0 0-1.415 1.414l.163.163a5.978 5.978 0 0 0-.83 1.43L.616 6.158a1 1 0 0 0 0 2.684l1.093.34c.19.51.47.99.83 1.43l-.163.163a1 1 0 1 0 1.415 1.414l.163-.163c.44.36.92.64 1.43.83l.34 1.093a1 1 0 0 0 2.684 0l.34-1.093c.51-.19.99-.47 1.43-.83l.163.163a1 1 0 0 0 1.414-1.414l-.163-.163c.36-.44.64-.92.83-1.43l1.093-.34a1 1 0 0 0 0-2.684l-1.093-.34a5.978 5.978 0 0 0-.83-1.43l.163-.163A1 1 0 0 0 12.21 2.81l-.163.163a5.97 5.97 0 0 0-1.43-.83L9.405 1.05zM8 10.5A2.5 2.5 0 1 1 8 5.5a2.5 2.5 0 0 1 0 5z" />
      </svg>
    ),
  },
];