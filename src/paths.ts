export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    listLine: '/dashboard/listLine',
    settings: '/dashboard/settings',
    inventory: '/dashboard/inventory',
    staft: '/dashboard/staft',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
