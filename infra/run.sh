kubectl create namespace ingress-nginx

helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install --namespace ingress-nginx ingress-nginx ingress-nginx/ingress-nginx

kubectl --namespace ingress-nginx patch svc ingress-nginx-controller -p '{"spec":{"externalTrafficPolicy":"Local"}}'

helm repo add jetstack https://charts.jetstack.io
kubectl create namespace cert-manager
helm install cert-manager jetstack/cert-manager --namespace cert-manager --version v0.15.1 --set installCRDs=true
