// for the tags in the dropdown
export const SUBSCRIPTION_OPTIONS = [
    {
        value: "Investment",
        label: "Investment",
        info: "Your investors will fund the entire investment amount upfront."
    },
    {
        value: "Commitment",
        label: "Commitment",
        info: "Investors commit a portion of capital upfront and fund the rest over time."
    }
];

export const STATUS_OPTIONS = [
    { value: "Draft", label: "Draft", info: "Not visible to users." },
    { value: "Accepting Reservations", label: "Accepting Reservations", info: "Users can reserve funds." },
    { value: "Accepting Investments", label: "Accepting Investments", info: "Users can invest now." },
    { value: "Managed", label: "Managed", info: "New investments are closed." },
    { value: "Past", label: "Past", info: "Offering has ended." }
];

export const VISIBILITY_OPTIONS = [
    { value: "No users", label: "No Users", info: "Hidden from all users." },
    { value: "Accredited Only", label: "Accredited Only", info: "Only accredited investors." },
    { value: "Verified Users", label: "Verified Users", info: "Only verified users." },
    { value: "All Users", label: "All Users", info: "Visible to everyone." }
];
