import React from 'react';
import useRequest from '../../hooks/use-request';
import { useRouter} from 'next/router';

export default () => {

  const router = useRouter()

  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => router.push('/auth/signed-out')
  })

  React.useEffect(() => {
    doRequest();
  }, [])

  return <div>Signing you out ...</div>
}