apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
  name: {{APP_NAME}}-ingress
  namespace: {{NAME_SPACE}}
spec:
  rules:
    - host: {{APP_NAME}}.c9d1c973fa315470eb49b82764004d642.cn-hangzhou.alicontainer.com
      http:
        paths:
          - backend:
              serviceName: {{APP_NAME}}
              servicePort: 80
            path: /
status:
  loadBalancer:
    ingress:
      - ip: 47.98.219.245