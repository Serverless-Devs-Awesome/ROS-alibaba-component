const Core = require('@alicloud/pop-core');
const fs = require('fs');
const {Component, Log} = require('@serverless-devs/s-core');

const log = new Log()
const defaultOpt = {
    method: 'POST',
    headers: {
        'User-Agent': 'alicloud-serverless-devs'
    }
}

class MyComponent extends Component {
    async getClient(credentials) {
        return new Core({
            accessKeyId: credentials.AccessKeyID,
            accessKeySecret: credentials.AccessKeySecret,
            endpoint: 'https://ros.aliyuncs.com',
            apiVersion: '2019-09-10'
        })
    }

    async deploy(inputs) {

        this.help(inputs, {
            description: `Usage: s ${inputs.Project.ProjectName} deploy [command]`,
        })

        // 获取密钥信息
        inputs.Credentials = await this.credentials(inputs)

        const client = await this.getClient(inputs.Credentials)

        await this.init()

        const stackName = inputs.Properties.Name
        const region = inputs.Properties.Region || "cn-hangzhou"

        const template = inputs.Properties.Template || "./ros.json"
        const policyObj = inputs.Properties.Policy || {}

        if (this.state && this.state.RegionId) {
            if (region != this.state.RegionId || stackName != this.state.StackName) {
                // remove
                log.warn(`Delete stack ${this.state.StackName} - ${this.state.StackId}`)
                await new Promise((resolve, reject) => {
                    client.request('DeleteStack', {
                        "RegionId": region,
                        "StackId": this.state.StackId
                    }, defaultOpt).then((result) => {
                        resolve(result);
                    }, (ex) => {
                        reject(ex)
                    })
                })
                log.warn(`Deleted stack ${this.state.StackName} - ${this.state.StackId}`)
            }
        }

        log.log("Start deploy ... ")
        log.log("Check stack ... ")
        const response = await new Promise((resolve, reject) => {
            client.request('ListStacks', {
                "RegionId": region,
                "StackName.1": stackName
            }, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                reject(ex)
            })
        })

        log.log("Get template body ... ")
        const templateBody = fs.readFileSync(template, 'utf-8');

        let StackPolicyURL
        let StackPolicyBody
        if (policyObj.Url) {
            StackPolicyURL = policyObj.Url
        }
        if (policyObj.Body) {
            StackPolicyBody = policyObj.Body
        }
        const requestBody = {
            "RegionId": region,
            "TemplateBody": templateBody
        }
        if (StackPolicyBody) {
            requestBody.StackPolicyBody = StackPolicyBody
        }
        if (!requestBody.StackPolicyBody && StackPolicyURL) {
            requestBody.StackPolicyURL = StackPolicyURL
        }

        const result = {
            "RegionId": region,
            "StackName": stackName
        }

        if (response.Stacks.length == 0) {
            // 创建逻辑
            log.log("Create stack ... ")
            requestBody.StackName = stackName
            const createResponse = await new Promise((resolve, reject) => {
                client.request('CreateStack', requestBody, defaultOpt).then((result) => {
                    resolve(result);
                }, (ex) => {
                    reject(ex)
                })
            })
            log.log(`Created stack: ${createResponse.StackId}`)
            result.StackId = createResponse.StackId
        } else {
            // 更新逻辑
            log.log("Update stack ... ")
            requestBody.StackId = response.Stacks[0].StackId
            result.StackId = response.Stacks[0].StackId
            const updateResponse = await new Promise((resolve, reject) => {
                client.request('UpdateStack', requestBody, defaultOpt).then((result) => {
                    resolve(result);
                }, (ex) => {
                    reject(ex)
                })
            })
            log.log(`Updated stack: ${requestBody.StackId}`)
        }

        this.state = result
        await this.save()

        return result
    }

    async remove(inputs) {

        this.help(inputs, {
            description: `Usage: s ${inputs.Project.ProjectName} remove [command]`,
        })

        // 获取密钥信息
        inputs.Credentials = await this.credentials(inputs)

        const client = await this.getClient(inputs.Credentials)

        await this.init()

        const stackName = inputs.Properties.Name
        const region = inputs.Properties.Region || "cn-hangzhou"

        log.log("Start remove ... ")
        log.log("Check stack ... ")
        const response = await new Promise((resolve, reject) => {
            client.request('ListStacks', {
                "RegionId": region,
                "StackName.1": stackName
            }, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                throw new Error(ex)
            })
        })
        if (response.Stacks.length == 0) {
            log.error(`Could not found this stack: ${stackName}`)
            return {}
        }

        log.log("Remove stack ... ")
        await new Promise((resolve, reject) => {
            client.request('DeleteStack', {
                "RegionId": region,
                "StackId": response.Stacks[0].StackId
            }, defaultOpt).then((result) => {
                resolve(result);
            }, (ex) => {
                reject(ex)
            })
        })
        log.log(`Removed stack: ${response.Stacks[0].StackId}`)

        this.state = {}
        await this.save()

        return {}
    }
}

module.exports = MyComponent;
