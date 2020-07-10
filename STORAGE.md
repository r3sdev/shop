Setup persistent storage

helm -n development install nfs-server stable/nfs-server-provisioner --set persistence.enabled=true,persistence.storageClass=do-block-storage,persistence.size=5Gi

helm -n production install nfs-server stable/nfs-server-provisioner --set persistence.enabled=true,persistence.storageClass=do-block-storage,persistence.size=5Gi


See https://www.digitalocean.com/community/tutorials/how-to-set-up-readwritemany-rwx-persistent-volumes-with-nfs-on-digitalocean-kubernetes