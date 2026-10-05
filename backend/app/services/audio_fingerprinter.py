import os
try:
    import acoustid
    import chromaprint
except ImportError:
    acoustid = None
    chromaprint = None

class AudioFingerprinter:
    THRESHOLD = 0.80

    def compute_fingerprint(self, file_path: str) -> tuple[float, list[int]]:
        if acoustid is None:
            raise ImportError("pyacoustid package is not available.")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Audio file not found: {file_path}")
            
        try:
            duration, fp_encoded = acoustid.fingerprint_file(file_path)
            fp_ints, _ = chromaprint.decode_fingerprint(fp_encoded)
            return duration, fp_ints
        except Exception as e:
            print(f"Error computing audio fingerprint: {e}")
            return 0.0, []

    def compare_fingerprints(self, fp1: list[int], fp2: list[int]) -> float:
        if not fp1 or not fp2:
            return 0.0
            
        set1 = set(fp1)
        set2 = set(fp2)
        
        if not set1 and not set2:
            return 1.0
        if not set1 or not set2:
            return 0.0
            
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        
        similarity = intersection / union if union > 0 else 0.0
        return similarity
