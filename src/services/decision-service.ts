import { CreateDecisionRequest, DecisionEvaluationResponse, ErrorResponse } from "../namespaces/TrustAuthorityDecision";
import * as http from '../api/http-request';
import {  postRequest } from "../api/http-request";
import appConfig from "../app-config";

export async function getDecisionEvaluation<DecisionEvaluationResponse, CreateDecisionRequest>(vid: string, vkey: string, decisionRequest: CreateDecisionRequest): Promise <DecisionEvaluationResponse | ErrorResponse> {
    return await postRequest(vid, vkey, appConfig.api.veracode.trustAuthorityDecisionUri, "/evaluate", decisionRequest);
}

export  function generatePullRequestComment(result:DecisionEvaluationResponse): string {
    if(result.result === "SAFE") {
        const score = "PASS";
        return `# ![Veracode](https://www.veracode.com/wp-content/themes/berg-theme-child/assets/images/favicon/favicon-32x32.png) Safe to Deploy\n## Veracode Trust Authority   ![95%](https://img.shields.io/badge/Trust%20Decision-${score}-2ea44f)\nThe application was automatically approved deployment to a target environment because all the assets pass the required policy gate.`;
    } else if(result.result === "UNSAFE") {
        const score = "FAIL";
        return `# ![Veracode](https://www.veracode.com/wp-content/themes/berg-theme-child/assets/images/favicon/favicon-32x32.png) Unsafe to Deploy\n## Veracode Trust Authority   ![${score}%](https://img.shields.io/badge/Trust%20Decision-${score}-red)\nThe application was automatically blocked from deployment to a target environment because one or more assets failed the required policy gate.`;
    } else {
        const score = "UNKNOWN";
        return `# ![Veracode](https://www.veracode.com/wp-content/themes/berg-theme-child/assets/images/favicon/favicon-32x32.png) Error evaluating deployment\n## Veracode Trust Authority   ![${score}%](https://img.shields.io/badge/Trust%20Decision-${score}-orange)\nAn error occurred while evaluating the deployment decision. Please check the logs for more details.`;
    }
    
}