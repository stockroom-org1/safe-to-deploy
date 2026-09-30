import { ErrorResponse } from "../namespaces/TrustAuthorityDecision";
import { AssetGroupResponse } from "../namespaces/AssetFinding";
export declare function getBusinessByName(vid: string, vkey: string, name: string): Promise<AssetGroupResponse | ErrorResponse>;
export declare function processArtifactsList(input: string, octokit: any): Promise<Array<{
    name: string;
    tag?: string;
    commitHash?: string;
}>>;
export declare function getAssetSnapshotIds(vid: string, vkey: string, artifacts: Array<{
    name: string;
    tag?: string;
    commitHash?: string;
}>): Promise<string[]>;
