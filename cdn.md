❯ BUCKET_NAME="assets-images"
❯ aws s3api list-objects-v2 \
  --bucket "$BUCKET_NAME" \
  --query "Contents[].Key" \
  --output text | tr '\t' '\n' | sed "s|^|${BASE_URL}/|"
https://cdn.zenspace.lat/1minus1-game-studio.webp
https://cdn.zenspace.lat/abel_ortega_huaraca_profile.webp
https://cdn.zenspace.lat/ai-for-trip-planner-app.webp
https://cdn.zenspace.lat/ai-powered-personal-stylist-app.webp
https://cdn.zenspace.lat/aquirin-brand-design.webp
https://cdn.zenspace.lat/beauty-skincare-ecommerce-app.webp
https://cdn.zenspace.lat/belgrade-arbor-architecture-website-design.webp
https://cdn.zenspace.lat/cimac-webapp-2.webp
https://cdn.zenspace.lat/culture-index-creative-studio.webp
https://cdn.zenspace.lat/dashboard-delivery-design.webp
https://cdn.zenspace.lat/halo-design-2.webp
https://cdn.zenspace.lat/healthcare-company-mobile-app.webp
https://cdn.zenspace.lat/hotel-booking-mobile-app-design.webp
https://cdn.zenspace.lat/isora-webapp-1.webp
https://cdn.zenspace.lat/jesper-landberg-website-studio.webp
https://cdn.zenspace.lat/junkbranding-portfolio-ch.webp
https://cdn.zenspace.lat/kyoosang-choi-brand-design.webp
https://cdn.zenspace.lat/lajoya-europe-website.webp
https://cdn.zenspace.lat/maison-auge-creative-studio.webp
https://cdn.zenspace.lat/makko-mobile-2.webp
https://cdn.zenspace.lat/mental-health-mobile-app.webp
https://cdn.zenspace.lat/miralife-cover.webp
https://cdn.zenspace.lat/miralife-desktop.webp
https://cdn.zenspace.lat/miralife.webp
https://cdn.zenspace.lat/mission-personal-injury-lawyer.webp
https://cdn.zenspace.lat/neu-cultured-concept-design.webp
https://cdn.zenspace.lat/nexterra-website-1.webp
https://cdn.zenspace.lat/nfl-league-brand-design.webp
https://cdn.zenspace.lat/offpossible-creative-portfolio.webp
https://cdn.zenspace.lat/offpossible-mobile-portfolio.webp
https://cdn.zenspace.lat/omnibuds-design-1.webp
https://cdn.zenspace.lat/onseis-studio-design.webp
https://cdn.zenspace.lat/pegassi-spotify-playlist.webp
https://cdn.zenspace.lat/penti-cover.webp
https://cdn.zenspace.lat/penti-desktop.webp
https://cdn.zenspace.lat/penti.webp
https://cdn.zenspace.lat/ramotion-mobile-1.webp
https://cdn.zenspace.lat/rapide-yacht-group-website.webp
https://cdn.zenspace.lat/real-state-booking-app.webp
https://cdn.zenspace.lat/retainer-website-2.webp
https://cdn.zenspace.lat/ronnsquare-architecture-website.webp
https://cdn.zenspace.lat/rova-smart-running-tracker-app.webp
https://cdn.zenspace.lat/rythm-cover.webp
https://cdn.zenspace.lat/rythm-desktop.webp
https://cdn.zenspace.lat/rythm.webp
https://cdn.zenspace.lat/second-ride-brand-design.webp
https://cdn.zenspace.lat/shipment-tracking-fleet-management-design.webp
https://cdn.zenspace.lat/smart-financial-management-app.webp
https://cdn.zenspace.lat/solar-energy-monitoring-mobile-app.webp
https://cdn.zenspace.lat/sonya-pesselev-portfoliio-design.webp
https://cdn.zenspace.lat/storey-architecture-website.webp
https://cdn.zenspace.lat/structure-consulting-engineers.webp
https://cdn.zenspace.lat/subscrr-cover.webp
https://cdn.zenspace.lat/subscrr-desktop.webp
https://cdn.zenspace.lat/subscrr.webp
https://cdn.zenspace.lat/sweet-tape-website.webp
https://cdn.zenspace.lat/swimtopia-business-website.webp
https://cdn.zenspace.lat/theobroma-chocolat-website-design.webp
https://cdn.zenspace.lat/think-big-studio-brand-design.webp
https://cdn.zenspace.lat/trust-guss-injury-lawyers.webp
https://cdn.zenspace.lat/unimatic-cover.webp
https://cdn.zenspace.lat/unimatic-desktop.webp
https://cdn.zenspace.lat/unimatic.webp
https://cdn.zenspace.lat/unipay-mobile-app-design-ui-ux.webp
https://cdn.zenspace.lat/web-design-for-manage-and-automate-payments.webp
https://cdn.zenspace.lat/zen-space-logo.webp
❯ BUCKET_NAME="assets-video"
❯ BASE_URL="https://cdn.aberu.site"
❯ aws s3api list-objects-v2 \
  --bucket "$BUCKET_NAME" \
  --query "Contents[].Key" \
  --output text | tr '\t' '\n' | sed "s|^|${BASE_URL}/|"
https://cdn.aberu.site/cimac-webapp-2.mp4
https://cdn.aberu.site/gsap-showreel.mp4
https://cdn.aberu.site/halo-design-2.mp4
https://cdn.aberu.site/isora-webapp-1.mp4
https://cdn.aberu.site/makko-mobile-2.mp4
https://cdn.aberu.site/nexterra-website-1.mp4
https://cdn.aberu.site/omnibuds-design-1.mp4
https://cdn.aberu.site/pentiai_1080p.mp4
https://cdn.aberu.site/pentiai_540p.mp4
https://cdn.aberu.site/pentiai_720p.mp4
https://cdn.aberu.site/pj-step-1.webm
https://cdn.aberu.site/pj-step-2.webm
https://cdn.aberu.site/pj-step-3.webm
https://cdn.aberu.site/ramotion-mobile-1.mp4
https://cdn.aberu.site/retainer-website-2.mp4
https://cdn.aberu.site/rythm_1080p.mp4
https://cdn.aberu.site/rythm_540p.mp4
https://cdn.aberu.site/rythm_720p.mp4
https://cdn.aberu.site/spiral2_large.mp4
https://cdn.aberu.site/spiral2_medium.mp4
https://cdn.aberu.site/spiral2_small.mp4
https://cdn.aberu.site/spiral_large.mp4
https://cdn.aberu.site/spiral_medium.mp4
https://cdn.aberu.site/spiral_small.mp4
https://cdn.aberu.site/subscrr_1080p.mp4
https://cdn.aberu.site/subscrr_540p.mp4
https://cdn.aberu.site/subscrr_720p.mp4
https://cdn.aberu.site/unimatic_1080p.mp4
https://cdn.aberu.site/unimatic_540p.mp4
https://cdn.aberu.site/unimatic_720p.mp4
https://cdn.aberu.site/woman_finger_1080p.mp4
https://cdn.aberu.site/woman_finger_640p.mp4
https://cdn.aberu.site/woman_finger_720p.mp4
