import React from 'react';
import { Navbar, Group, Code, ScrollArea, createStyles, rem,
    Box,
    Collapse,
    ThemeIcon,
    Text,
    UnstyledButton,
    Button,

} from '@mantine/core';
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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

// import { Logo } from './Logo';

const mockdata = [
    // { label: 'Dashboard', icon: IconGauge, links : [ {link: '/dashboard' }]},
    {
        label: 'Add Forms',
        icon: IconNotes,
        initiallyOpened: true,
        links: [
            { label: 'Products', link: '/add-product' },
            { label: 'Category', link: '/add-category' },
            { label: 'Brand', link: '/add-brand' },
            { label: 'Banner', link: '/add-banner'}
        ],
    },
    {
        label: 'Store Inventory',
        icon: IconCalendarStats,
        links: [
            { label: 'Products', link: '/product-table' },
            { label: 'Order', link: '/order-table' },
            { label: 'Category', link: '/category-table' },
            { label: 'Brand', link: '/brand-table' },
            { label: 'User', link: '/user' },
            { label: 'NewLetter', link: '/newsletter' },
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
    const navigate = useNavigate();
    const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);
    const { isAuthenticated, user, logout, checkauth } = useAuth();
    const isAdmin = user?.is_admin;

    const [userProfile, setUserProfile] = React.useState(null);
    const handleLogout = () => {
        localStorage.removeItem('admin');
        localStorage.removeItem('authenticated')
        localStorage.removeItem('jwtToken');
        navigate('/login');
    };
    return (
        <Navbar width={{ sm: 200 }} p="md" className={classes.navbar}>
            <Navbar.Section grow className={classes.links} component={ScrollArea}>
                
                <div className={classes.linksInner}>

                    {links}</div>
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <UserButton
                    image="https://images.unsplash.com/photo-1612833609249-5e9a9f8a4b0f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWRtaW58ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
                    name={user?.username}
                    email={user?.email}
                />
                {
                    isAuthenticated && (
                        <UnstyledButton onClick={handleLogout}
                        style={{
                            marginTop: 20,
                            marginLeft: 20,
                        }}
                        >Logout</UnstyledButton>
                    )
                }
  
            </Navbar.Section>
        </Navbar>
    );
}