const BRAND = {
    primary: "#3b6d92",
    secondary: "#f05a28",
    dark: "#747474",
    light: "#bfbfbf",
};

// list of fields we want to show on the UI in the exact order
const FIELDS_CONFIG = [
    { key: "Name", label: "Name", type: "text" },
    { key: "userName", label: "Username", type: "text" },
    { key: "email", label: "Email", type: "text", readOnly: true },
    { key: "phone", label: "Phone", type: "text" },
    { key: "company", label: "Company", type: "text" },
    { key: "address", label: "Address", type: "text" },
    { key: "town", label: "Town", type: "text" },
    { key: "Region", label: "Region", type: "text" },
    { key: "country", label: "Country", type: "text" },
    { key: "postalCode", label: "Postal Code", type: "text" },
    { key: "taxNumber", label: "Tax Number", type: "text" },
    { key: "role", label: "Role", type: "text", readOnly: true },
    // booleans
    { key: "NotificationEmail", label: "Notification Email", type: "boolean" },
    { key: "PendingOrderEmail", label: "Pending Order Email", type: "boolean" },
    { key: "OOSEmail", label: "Out Of Stock Email", type: "boolean" },
    { key: "UpdatedEmail", label: "Updated Email", type: "boolean" },
    // { key: "AccountOpen", label: "Account Open", type: "boolean" },

    // { key: "profileImage", label: "Profile Image", type: "file" },
];

// build default (empty) user object from config
const buildDefaultUser = () => {
    const base = {};
    FIELDS_CONFIG.forEach((f) => {
        base[f.key] = f.type === "boolean" ? false : "";
    });
    // include profileImage placeholder
    base.profileImage = null;
    return base;
};

const userInfoSample = {
    ...buildDefaultUser(),
    Name: "Syed Hamza",
    userName: "hamza_dev",
    phone: "0300-1234567",
    company: "TechVision",
    address: "House #123, Street 9",
    town: "Gulshan",
    Region: "Sindh",
    country: "Pakistan",
    postalCode: "75300",
    taxNumber: "NTN-1234567",
    profileImage: {
        url: "https://res.cloudinary.com/dfztjk3iv/image/upload/v1766476831/user-profiles/hqjhckmh0yd51pfjsru7.png",
        public_id: "user-profiles/hqjhckmh0yd51pfjsru7",
        alt: "Syed....'s profile picture"
    },
    NotificationEmail: true,
    PendingOrderEmail: false,
    OOSEmail: true,
    UpdatedEmail: false,
};

const providersSample = [
    {
        id: 1,
        name: "FastShip",
        description:
            "FastShip provides same-day shipping within major cities and affordable nationwide rates for bulk orders.",
    },
    {
        id: 2,
        name: "CloudCarrier",
        description:
            "CloudCarrier is specialised in fragile item handling with real-time tracking and insurance options.",
    },
    {
        id: 3,
        name: "LocalGo",
        description: "Economical last-mile provider for smaller goods in urban areas.",
    },
];

const categoriesSample = [
    { id: 1, name: "Electronics", color: "#3b6d92", image: 'https://i.pinimg.com/736x/37/b8/da/37b8da1abf03a7defd4dfc76d9f8d536.jpg' },
    { id: 2, name: "Home & Kitchen", color: "#f05a28", image: 'https://i.pinimg.com/736x/37/b8/da/37b8da1abf03a7defd4dfc76d9f8d536.jpg' },
    { id: 3, name: "Apparel", color: "#747474", image: 'https://i.pinimg.com/736x/37/b8/da/37b8da1abf03a7defd4dfc76d9f8d536.jpg' },
];


export {
    BRAND,
    FIELDS_CONFIG,
    buildDefaultUser,
    userInfoSample,
    providersSample,
    categoriesSample
}