import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export class NetworkWithCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add("description", "OKD - Testing");
    cdk.Tags.of(this).add("organization", "3sky.dev");
    cdk.Tags.of(this).add("owner", "kuba");

    const myVPC = new ec2.Vpc(this, 'MyVPC', {
      ipAddresses: ec2.IpAddresses.cidr('10.192.0.0/20'),
      maxAzs: 2,
      natGateways: 2,
      subnetConfiguration: [
        {
          cidrMask: 26,
          name: 'ingress',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 26,
          name: 'application',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'rds',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ]
    });

    new ec2.Instance(this, 'targetInstance', {
      vpc: myVPC,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      instanceName: "TestingInstance",
      allowAllOutbound: true,
      detailedMonitoring: true,
      role: new iam.Role(this, "TestingEc2Role", {
        roleName: "TestingEc2Role",
        assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
        description: "Test CDK with intances",
        path: '/',
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
        ],
      }),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
    });
  }
}
