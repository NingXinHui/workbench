#!/bin/bash
cmd=$1
docker_file_name=$2
source docker/test.env || exit 1

function init_k8s(){
    mkdir -p /root/.kube
    echo ${HS_CONFIG} | base64 -d > /root/.kube/config
    export KUBECONFIG=/root/.kube/config
}

# 主流程
if [ -z "$cmd" ]; then
  echo "命令不能为空"
  exit 1
elif [ "$cmd" == "push_web" ]; then
  docker login -u $ALI_USER_NAME -p $ALI_USER_PASSWORD $ALI_REGISTRY_URL
  echo "push...$APP_NAME:$IMAGE_TAG"

  docker build -t "${ALI_REGISTRY_URL}/${ALI_HUANSI_YL_REGISTRY_NAME}/$APP_NAME:${IMAGE_TAG}" .
  docker push "${ALI_REGISTRY_URL}/${ALI_HUANSI_YL_REGISTRY_NAME}/$APP_NAME:${IMAGE_TAG}" || exit 1
  
elif [ "$cmd" == "deploy_web" ]; then
  echo "deploy_test..."
  echo ${IMG_NAME}
  kubectl get secret dayaosecret
  if [ $? -ne 0 ]; then
    kubectl create secret docker-registry dayaosecret -n dayao-test --docker-server=${ALI_REGISTRY_URL} --docker-username=${ALI_USER_NAME} --docker-password=${ALI_USER_PASSWORD}
  fi
  sed -e "s#{{SECRETS}}#dayaosecret#g;s#{{NAME_SPACE}}#${NAME_SPACE}#g;s#{{APP_NAME}}#$APP_NAME#g;s#{{APP_PORT}}#$APP_PORT#g;s#{{PROFILES}}#$PROFILES#g;s#{{APP_TARGET_PORT}}#$APP_TARGET_PORT#g;s#{{CONTAINER_PORT}}#$CONTAINER_PORT#g;s#{{IMAGE_URL}}#${ALI_REGISTRY_URL}/${ALI_HUANSI_YL_REGISTRY_NAME}/$APP_NAME#g;s#{{IMAGE_TAG}}#$IMAGE_TAG#g" docker/k8s_web.tpl > docker/k8s_web.yaml
  cat docker/k8s_web.yaml
  echo -e "\n"
  kubectl apply -f docker/k8s_web.yaml
  echo "$INGRESS"
  if [ ! -z "$INGRESS" ];then
    echo "开启域名配置"
    sed -e "s#{{NAME_SPACE}}#${NAME_SPACE}#g;s#{{APP_NAME}}#$APP_NAME#g" docker/ingress.tpl > docker/ingress.yaml
    cat docker/ingress.yaml
    echo -e "\n"
    kubectl apply -f docker/ingress.yaml
  fi
elif [ "$cmd" == "init_k8s" ]; then
  echo "init_k8s..."
  echo ${HS_CONFIG}
  mkdir -p /root/.kube
  echo ${HS_CONFIG} | base64 -d > /root/.kube/config
  export KUBECONFIG=/root/.kube/config
else
  echo "无效命令:$cmd"
  exit 1
fi
