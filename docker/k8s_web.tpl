apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: {{NAME_SPACE}}
  name: {{APP_NAME}}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {{APP_NAME}}
  template:
    metadata:
      labels:
        app: {{APP_NAME}}
    spec:
      imagePullSecrets:
      - name: {{SECRETS}}
      containers:
      - name: {{APP_NAME}}
        image: {{IMAGE_URL}}:{{IMAGE_TAG}}
        imagePullPolicy: Always
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  namespace: {{NAME_SPACE}}
  name: {{APP_NAME}}
  labels:
    role: {{APP_NAME}}
spec:
  ports:
  - name: {{APP_NAME}}
    port: 80
    targetPort: 80
  selector:
    app: {{APP_NAME}}
  #type: NodePort
  #type: LoadBalancer
  type: ClusterIP