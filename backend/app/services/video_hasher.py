import os
try:
    from videohash import VideoHash
except ImportError:
    VideoHash = None

class VideoHasher:
    THRESHOLD = 10
    
    def compute_hash(self, video_path: str) -> str:
        if VideoHash is None:
            raise ImportError("videohash package is not available.")
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file not found: {video_path}")
            
        try:
            vh = VideoHash(path=video_path)
            return vh.hash_hex
        except Exception as e:
            print(f"Error computing video hash: {e}")
            return ""

    def compare_hashes(self, hash1: str, hash2: str) -> tuple[bool, float]:
        if not hash1 or not hash2:
            return False, 0.0
            
        try:
            int1 = int(hash1, 16)
            int2 = int(hash2, 16)
            xor_result = int1 ^ int2
            distance = bin(xor_result).count('1')
            
            is_similar = distance <= self.THRESHOLD
            max_bits = len(bin(int1)) - 2
            confidence = max(0.0, 1.0 - (distance / max_bits)) if max_bits > 0 else 0.0
            
            return is_similar, confidence
        except ValueError:
            return False, 0.0
