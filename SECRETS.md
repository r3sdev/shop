kubectl create secret docker-registry regcred --docker-server=docker.io --docker-username=<username> --docker-password=<password> --docker-email=<email>

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<key_here>

kubectl create secret generic stripe-secret --from-literal=STRIPE_SECRET=<key_here>
kubectl create secret generic stripe-key --from-literal=STRIPE_KEY=<key_here>

kubectl create secret generic smtp-user-secret --from-literal=SMTP_USER=<key_here>
kubectl create secret generic smtp-password-secret --from-literal=SMTP_PASSWORD=<key_here>

kubectl create secret generic twilio-auth-token --from-literal=TWILIO_AUTH_TOKEN=<key_here>
kubectl create secret generic twilio-account-sid --from-literal=TWILIO_ACCOUNT_SID=<key_here>

kubectl create secret generic spaces-key --from-literal=SPACES_KEY=<key_here>
kubectl create secret generic spaces-secret --from-literal=SPACES_SECRET=<key_here>
