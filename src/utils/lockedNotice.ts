// Utility to trigger locked feature notification across the application
export const triggerLockedFeatureMessage = (featureName?: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('hasan_quran_locked_feature_clicked', {
        detail: { featureName: featureName || '' }
      })
    );
  }
};
