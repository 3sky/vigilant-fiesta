import * as cdk from 'aws-cdk-lib';
import { Capture, Template } from 'aws-cdk-lib/assertions';
import * as NetworkWithCdk from '../lib/network-with-cdk-stack';


test('VPC has correct range', () => {
    const app = new cdk.App();
    //     // WHEN
    const stack = new NetworkWithCdk.NetworkWithCdkStack(app, 'MyTestStack');
    //     // THEN
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::EC2::VPC', {
        CidrBlock: "10.192.0.0/20",
        EnableDnsHostnames: true,
        EnableDnsSupport: true
        //     VisibilityTimeout: 300
    });
});

test('VPC has 6 subnets', () => {
    const app = new cdk.App();
    //     // WHEN
    const stack = new NetworkWithCdk.NetworkWithCdkStack(app, 'MyTestStack');
    //     // THEN
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::Subnet', 6);

});

test('VPC has 2 NATs', () => {
    const app = new cdk.App();
    //     // WHEN
    const stack = new NetworkWithCdk.NetworkWithCdkStack(app, 'MyTestStack');
    //     // THEN
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::NatGateway', 2);
});

test('VPC has 1 Igtw', () => {
    const app = new cdk.App();
    //     // WHEN
    const stack = new NetworkWithCdk.NetworkWithCdkStack(app, 'MyTestStack');
    //     // THEN
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::InternetGateway', 1);
});

test('Stack has one instance', () => {
    const app = new cdk.App();
    //     // WHEN
    const stack = new NetworkWithCdk.NetworkWithCdkStack(app, 'MyTestStack');
    //     // THEN
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::Instance', 1);
});

test('Instance has correct properties', () => {
    const app = new cdk.App();
    //     // WHEN
    const stack = new NetworkWithCdk.NetworkWithCdkStack(app, 'MyTestStack');
    //     // THEN
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::EC2::Instance', {
        InstanceType: "t2.micro",
        Monitoring: true,
    });
});

test("Check security group settings", () => {

    const app = new cdk.App();
    //     // WHEN
    const stack = new NetworkWithCdk.NetworkWithCdkStack(app, 'MyTestStack');
    //     // THEN
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::EC2::SecurityGroup', {
        SecurityGroupEgress: [
            { "CidrIp": "0.0.0.0/0" }
        ],
    });
});

test("Check is InstanceProfile exists", () => {

    const app = new cdk.App();
    //     // WHEN
    const stack = new NetworkWithCdk.NetworkWithCdkStack(app, 'MyTestStack');
    //     // THEN
    const template = Template.fromStack(stack);

    template.hasResource('AWS::IAM::InstanceProfile', {});
});
