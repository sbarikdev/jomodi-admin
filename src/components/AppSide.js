import { Navbar, Group, Code, ScrollArea, createStyles, rem } from '@mantine/core';
import {
    IconNotes,
    IconCalendarStats,
    IconGauge,
    IconPresentationAnalytics,
    IconFileAnalytics,
    IconAdjustments,
    IconLock,
} from '@tabler/icons-react';
import { UserButton } from './UserButton';
import { LinksGroup } from './NavbarLinksGroup';
// import { Logo } from './Logo';

const mockdata = [
    { label: 'Dashboard', icon: IconGauge, link: '/' },
    {
        label: 'Add Forms',
        icon: IconNotes,
        initiallyOpened: true,
        links: [
            { label: 'Products', link: '/add-product' },
            { label: 'Category', link: '/add-category' },
            { label: 'Brand', link: '/add-brand' },
        ],
    },
    {
        label: 'Tables',
        icon: IconCalendarStats,
        links: [
            { label: 'Products', link: '/product-table' },
            { label: 'Order', link: '/order-table' },
            { label: 'Category', link: '/category-table' },
            { label: 'Brand', link: '/brand-table' },
        ],
    },
    // { label: 'Analytics', icon: IconPresentationAnalytics },
    // { label: 'Contracts', icon: IconFileAnalytics },
    // { label: 'Settings', icon: IconAdjustments },
    // {
    //     label: 'Security',
    //     icon: IconLock,
    //     links: [
    //         { label: 'Enable 2FA', link: '/' },
    //         { label: 'Change password', link: '/' },
    //         { label: 'Recovery codes', link: '/' },
    //     ],
    // },
];

const useStyles = createStyles((theme) => ({
    navbar: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        paddingBottom: 0,
    },

    header: {
        padding: theme.spacing.md,
        paddingTop: 0,
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
    },

    links: {
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
    },

    linksInner: {
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
    },

    footer: {
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
        borderTop: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,
    },
}));

export default function AppSide() {
    const { classes } = useStyles();
    const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <Navbar width={{ sm: 300 }} p="md" className={classes.navbar}>
            <Navbar.Section grow className={classes.links} component={ScrollArea}>
                <div className={classes.linksInner}>{links}</div>
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <UserButton
                    image="https://images.unsplash.com/photo-1612833609249-5e9a9f8a4b0f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWRtaW58ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
                    name="Admin"
                    email="admin@jomodi.com"
                />
            </Navbar.Section>
        </Navbar>
    );
}