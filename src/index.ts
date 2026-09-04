import * as core from '@actions/core';
import * as github from '@actions/github';


async function run() {
   try {
        const token = core.getInput("github_token");
        const owner = core.getInput("repository_owner");
        const repo = core.getInput("repository_name");
        const decision_mode = core.getInput("decision_mode");
        const branch = core.getInput("source_branch");
        const repository = core.getInput("repository");
        const artifacts_list = core.getInput("artifacts_list");
        const pull_number = core.getInput("pull_request");
        const octokit = github.getOctokit(token);
        console.log(JSON.stringify(pull_number));
        const eventName = github.context.eventName;
        console.log(eventName);
        if (eventName === "pull_request") {
            console.log("Triggered by Pull Request");

        }else if (eventName === "push"  || eventName === "workflow_dispatch") {
            console.log("Triggered by Push");
            const requestBody = {
                "type": "Deployment",
                "target": "Prod",
                "scope": [
                    {
                    "businessApplicationId": "",
                    "businessApplicationVersion": "",
                    "assetSnapshotIds": artifacts_list.split(",")
                    }
                ]
            };
            console.log("requestBody");
            console.log(JSON.stringify(requestBody ));
            const response = await fetch("https://moocher-uproot-cobbler.ngrok-free.dev/api/v1/evaluate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)
            });
            const responseBody = await response.json();
            console.log(JSON.stringify(responseBody));
            core.setOutput("response", JSON.stringify(responseBody));
        }
            
        
        core.setOutput("summary", `Repository: ${repository}\nArtifacts List: ${artifacts_list}`);

        
    
    } catch (error: any) {
        core.setFailed("Error in Pipeline: " + error.message);
    }
}

run();