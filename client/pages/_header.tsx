import React from 'react';
import { useRouter } from 'next/router'
import { HeaderProps } from '../types';
import { Header } from '../components';
import { AdminHeader } from '../components/admin';


const _Header = (props: HeaderProps) => {

    const router = useRouter();

    const pathname = router?.pathname || ''

    const isAdminRoute = pathname.startsWith("/admin");


    return isAdminRoute ? <AdminHeader /> : <Header {...props} />
}

export default _Header;