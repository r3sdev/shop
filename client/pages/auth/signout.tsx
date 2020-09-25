import React from 'react';
import useRequest from '../../hooks/use-request';
import { useRouter} from 'next/router';

const SignOut = () => {

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

  return <div className="mt-5 mb-5">Signing you out ...</div>
}

export default SignOut;