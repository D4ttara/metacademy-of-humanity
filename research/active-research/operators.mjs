export const ACTIVE = "OWNER_APPROVED_ACTIVE_RESEARCH";

export function behavioralSimilarity(observedBehavior, similarityClass, functionalEquivalence = "UNASSESSED") {
  return { OBSERVED_BEHAVIOR: observedBehavior, SIMILARITY_CLASS: similarityClass, FUNCTIONAL_EQUIVALENCE: functionalEquivalence, ONTOLOGICAL_CLAIM: "UNASSERTED", EVIDENCE_FOR_ONTOLOGICAL_CLAIM: [], UNKNOWN: ["ontology"] };
}
export const autonomyProfile = dimensions => ({ ...dimensions, classification: "PROFILE_NOT_BINARY" });
export const delegationLedger = entries => ({ entries, causalLoad: entries.reduce((out, item) => ({ ...out, [item.carrier]: (out[item.carrier] ?? 0) + item.load }), {}) });
export const systemFieldUnit = ({ body, field, coupling, history, isolatedAdequate = false }) => isolatedAdequate ? { unit: "BODY", body } : { unit: "SYSTEM_X_FIELD", body, field, coupling, history };
export const relationalEmergence = ({ sameParts, topologyA, topologyB, resultA, resultB, hiddenComponents = false, extraCompute = false }) => ({ sameParts, topologyA, topologyB, resultA, resultB, relationEffect: !hiddenComponents && !extraCompute && resultA !== resultB, guard: { hiddenComponents, extraCompute } });
export const boundaryProfile = functions => ({ ...functions, boundaryIsBoolean: false });
export const participationAutonomy = ({ autonomy, participation, domain, partner, effect }) => ({ AUTONOMY_STATUS: autonomy, PARTICIPATION_STATUS: participation, PARTICIPATION_DOMAIN: domain, PARTNER_SYSTEM: partner, OBSERVED_EFFECT: effect });
export const governanceCoGrowth = ({ capabilityDelta, governanceDelta, risk = "low" }) => ({ verdict: capabilityDelta === 0 || (risk === "low" ? governanceDelta >= 0 : governanceDelta > 0) ? "LEGIBLE" : "GOVERNANCE_GAP", capabilityDelta, governanceDelta, risk });
export const originStatus = ({ origin, criteria }) => ({ origin, status: criteria?.length ? "CRITERIA_REQUIRED" : "UNKNOWN", prohibitedShortcut: true });
export const closureThreshold = measures => ({ candidateMeasures: measures, conclusion: "UNKNOWN_UNTIL_SCOPE_EVIDENCE", universalScalar: false });

export const negativeResultInformation = ({ sensitivityKnown, signalObserved }) => ({ result: !signalObserved && sensitivityKnown ? "CONSTRAINS_SCOPE" : "WEAK_NULL", claim: "NOT_UNIVERSAL" });
export const frontierConsensus = ({ replication, scope }) => ({ zone: replication >= 2 ? "CONSENSUS_CANDIDATE" : "FRONTIER", scope });
export const toolTheory = ({ toolPower, rivalDiscrimination }) => ({ toolPower, theoryPower: rivalDiscrimination, verdict: rivalDiscrimination > 0 ? "DISTINGUISHES_RIVALS" : "NO_THEORY_GAIN" });
export const verifiabilityPassport = passport => ({ status: ["data", "method", "sensitivity", "replication"].every(key => passport[key]) ? "COMPLETE" : "INCOMPLETE", falseVerdict: false });
export const anomalyMaturation = ({ signal, replication, rivals, strongerTest }) => ({ stage: !signal ? "NO_SIGNAL" : !replication ? "AWAITING_REPLICATION" : strongerTest ? "SURVIVES_CURRENT_TEST" : "RIVAL_REVIEW", rivals });
export const incentiveFieldAudit = disclosure => ({ disclosure, verdictOnResult: "NONE", action: disclosure.conflict ? "EXTRA_SCRUTINY" : "ORDINARY_SCRUTINY" });
export const hypeDelta = layers => ({ delta: Math.max(0, layers.headline - layers.paper), layers, claim: "COMMUNICATION_GAP_NOT_EVIDENCE" });
export const mathematicalBeauty = ({ beauty, empiricalSupport, distinctivePrediction }) => ({ beauty, empiricalSupport, distinctivePrediction, evidence: empiricalSupport ? "EMPIRICAL" : "NOT_ESTABLISHED" });
export const critiqueOfScience = ({ reproducibilityIssue, independentValidation }) => ({ reproducibilityIssue, independentValidation, methodRejected: false, resultStatus: independentValidation ? "SUPPORTED_WITH_LIMITS" : "OPEN" });
export const epistemicBandwidth = ({ volume, discrimination, verificationCapacity }) => ({ volume, discrimination, verificationCapacity, priority: discrimination > 0 && verificationCapacity > 0 ? "VERIFY_AND_COMPARE" : "DO_NOT_SCALE_BY_VOLUME" });
