// Supabase Configuration
// Exposed as a global variable so the portfolio can run locally via file:// protocol without CORS blocks
window.CONFIG = {
  SUPABASE_URL: "https://mvslanzuxigqrzsycmfw.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_OBzyXaqlyNg37VFTdSp0bQ_36OJ9J-o",
  // Secret key used for admin writes. In a production app, you should not expose this on the client side.
  // We use this key for the editor functionality in this personal portfolio dashboard.
  SUPABASE_SECRET_KEY: "sb_secret_Fld0UJancbBOwa4Ouda5Ig_cF18gu9f"
};
