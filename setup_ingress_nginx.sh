#!/bin/sh
kubectl create namespace ingress-nginx
helm install --namespace ingress-nginx ingress-nginx ingress-nginx/ingress-nginx
