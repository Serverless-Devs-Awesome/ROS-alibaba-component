# Preface
  
  
  
  Through this component, the project can be quickly deployed through ROS

# Test

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

# Complete configuration

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

# Parameter details

| Name |  Required  |  Type  |  Description  |
| --- |  ---  |  ---  |  ---  |
| Region | True | Enum | Region |
| Name | True | String | Stack Name |
| Template | True | String | Template local dir |
| Policy | False | Struct | Policy config |

## Policy
| Name |  Required  |  Type  |  Description  |
| --- |  ---  |  ---  |  ---  |
| Body | False | String | It contains the structure of the resource stack policy body, with a length of 1-16384 bytes. |
| Url | False | String | The location of the file containing the resource stack policy. The URL must point to the web server (HTTP or HTTPS) or Alibaba cloud OSS bucket (for example： oss://ros/stack-policy/demo , oss://ros/stack-policy/demo?RegionId=cn-hangzhou ）The maximum length of the policy file is 16384 bytes. It is the same as the default regionid parameter, if not specified. |
