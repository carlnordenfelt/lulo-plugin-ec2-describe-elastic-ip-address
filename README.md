# lulo EC2 Describe Elastic IP Address

lulo EC2 Describe Elastic IP Address describes an existing EC2 Elastic IP.
It will respond with an error if the IP Address does not exist.

lulo EC2 Describe Elastic IP Address is a [lulo](https://github.com/carlnordenfelt/lulo) plugin

# Installation
```
npm install lulo-plugin-ec2-describe-elastic-ip-address --save
```

## Usage
### Properties
* IPAddress: The IP Address you want to describe. Required.
* For further properties, see the [AWS SDK Documentation for EC2::describeAddresses](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeAddresses-property)

### Return Values
When the logical ID of this resource is provided to the Ref intrinsic function, Ref returns the ElasticIP public IP.

`{ "Ref": "Preset" }`

The following properties can be accessed via `Fn::GetAtt` when available:
* InstanceId
* PublicIp
* AllocationId
* AssociationId
* Domain
* NetworkInterfaceId
* NetworkInterfaceOwnerId
* PrivateIpAddress

### Required IAM Permissions
The Custom Resource Lambda requires the following permissions for this plugin to work:
```
{
   "Effect": "Allow",
   "Action": [
       "ec2:DescribeAddresses"
   ],
   "Resource": "*"
}
```

## License
[The MIT License (MIT)](/LICENSE)

## Change Log
[Change Log](/CHANGELOG.md)
