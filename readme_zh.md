# 前言

通过该组件，快速通过 ROS 部署项目

# 测试

template.yaml

```
MyROSDemo:
  Component: ros
  Provider: alibaba
  Properties:
    Region: cn-hangzhou
    Name: test
    Template: ./temp.json
```

temp.json

```
{
  "ROSTemplateFormatVersion": "2015-09-01"
}
```

# 完整配置

```
MyROSDemo:
  Component: ros
  Provider: alibaba
  Properties:
    Region: cn-hangzhou
    Name: test
    Template: ./temp.json
    Policy:
      Url: url
      Body: body
```

# 参数详情

| 参数名 |  必填  |  类型  |  参数描述  |
| --- |  ---  |  ---  |  ---  |
| Region | True | Enum | 地域 |
| Name | True | String | Stack 名字 |
| Template | True | String | Template 本地路径 |
| Policy | False | Struct | Policy 配置 |

## Policy
| 参数名 |  必填  |  类型  |  参数描述  |
| --- |  ---  |  ---  |  ---  |
| Body | False | String | 包含资源栈策略主体的结构，长度为1~16,384个字节。 |
| Url | False | String | 包含资源栈策略的文件的位置。 URL必须指向位于Web服务器（HTTP或HTTPS）或阿里云OSS存储桶（例如：oss://ros/stack-policy/demo、oss://ros/stack-policy/demo?RegionId=cn-hangzhou）中的策略，策略文件最大长度为16,384个字节。 如未指定OSS地域，默认与接口参数RegionId相同。 |

