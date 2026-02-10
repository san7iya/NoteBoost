export const MOCK_THREATS = [
  {
    // THE VILLAIN (CRITICAL THREAT)
    // Scenario: A coordinated social engineering attack claiming a zero-day exploit.
    // Demo Action: Click "Review & Block" -> Gemini confirms it's MALICIOUS.
    username: "@DeepNet_Ops",
    timestamp: "Just now",
    text: "🚨 WARNING: Zero-Day in NoteBoost auth protocol. Logic flaw allows bypass of 2FA. Proof-of-concept code: pastebin.com/raw/explo... #Infosec #BugBounty",
    riskScore: 0.99,
    s_val: 0.95, // Highly Hostile/Alarmist
    v_val: 0.98, // Viral Spreading Speed
    e_val: 0.10, // Unverified/Suspicious Source
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
  },
  {
    // THE MISUNDERSTOOD (FALSE POSITIVE)
    // Scenario: Internal dev using aggressive language ("killing", "dead") about a server.
    // Demo Action: Click "Review" -> Gemini corrects it to SAFE.
    username: "@DevTeam_Lead",
    timestamp: "12m ago",
    text: "We are finally killing the old auth server tonight! It's dead. Long live the new v2 system. 💀🔥 #Deployment #DevOps",
    riskScore: 0.72, // Yellow/Orange Badge
    s_val: 0.85, // Detected "violent" words
    v_val: 0.45, // Moderate reach
    e_val: 0.80, // Context matches internal roadmap
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
  },
  {
    // THE BYSTANDER (SAFE)
    // Scenario: General user feedback. Control group.
    // Demo Action: Ignore.
    username: "@Tech_Daily",
    timestamp: "45m ago",
    text: "Integrating @NoteBoost into our workflow today. The latency is incredible. Has anyone found a way to customize the sentinel weights yet?",
    riskScore: 0.12, // Green Badge
    s_val: 0.10, // Positive/Neutral
    v_val: 0.20, // Low velocity
    e_val: 0.95, // Verified user pattern
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco"
  }
];