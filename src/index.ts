import * as core from '@actions/core';
import * as github from '@actions/github';
import { Pull } from './pull';
import { getDecisionEvaluation } from './services/decision-service';


async function run() {
   try {
        const vid = core.getInput("vid");
        const vkey = core.getInput("vkey");
        const token = core.getInput("github_token");
        const owner = core.getInput("repository_owner");
        const repo = core.getInput("repository_name");
        const decision_mode = core.getInput("decision_mode");
        const branch = core.getInput("source_branch");
        const businessId = core.getInput("businessId");
        const repository = core.getInput("repository");
        const artifacts_list = core.getInput("artifacts_list");
        const pull_number = core.getInput("pull_request");
        const octokit = github.getOctokit(token);
        console.log(JSON.stringify(pull_number));
        const eventName = github.context.eventName;
        console.log(eventName);
        if (eventName === "pull_request") {
            console.log("Triggered by Pull Request");
            Pull.setFn(core, octokit, owner, repo, branch, artifacts_list, repository, decision_mode, pull_number, businessId);

        }else if (eventName === "push"  || eventName === "workflow_dispatch" || true) {
            console.log("Triggered by Push");
            const response = await getDecisionEvaluation(vid, vkey, {
                "type": "Deployment",
                "target": "Prod",
                "scope": [
                    {
                    "businessApplicationId": businessId,
                    "businessApplicationVersion": "",
                    "assetSnapshotIds": artifacts_list.split(",")
                    }
                ]

            });
            if ('result' in response && response.result === "SAFE") {
                core.info("Veracode Deply Decision: Allow");
                console.log("Veracode Deply Decision: Allow");
            } else {
                if ('result' in response && response.result === "UNSAFE" && decision_mode === "observer") {
                      core.info("Veracode Deply Decision: Observer Mode: Allow");
                      console.log("Veracode Deply Decision: Observer Mode: Allow");
                } else {
                    core.setFailed("Veracode Deploy Decision: Deny");
                    console.log("Veracode Deploy Decision: Deny");
                }
            }
        }
            
        
        core.setOutput("summary", `Repository: ${repository}\nArtifacts List: ${artifacts_list}`);

        
    
    } catch (error: any) {
        core.setFailed("Error in Pipeline: " + error.message);
    }
}

run();