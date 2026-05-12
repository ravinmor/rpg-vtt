export function getBoundingBox(path) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    path.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
    });
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

export function checkIntersection(s1, s2) {
    const denom = (s1.p1.x - s1.p2.x) * (s2.p1.y - s2.p2.y) - (s1.p1.y - s1.p2.y) * (s2.p1.x - s2.p2.x);
    if (denom === 0) return null;
    const t = ((s1.p1.x - s2.p1.x) * (s2.p1.y - s2.p2.y) - (s1.p1.y - s2.p1.y) * (s2.p1.x - s2.p2.x)) / denom;
    const u = -((s1.p1.x - s1.p2.x) * (s1.p1.y - s2.p1.y) - (s1.p1.y - s2.p1.y) * (s1.p1.x - s2.p1.x)) / denom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return { x: s1.p1.x + t * (s1.p2.x - s1.p1.x), y: s1.p1.y + t * (s1.p2.y - s1.p1.y) };
    }
    return null;
}

export function isPointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) &&
            (point.x < ((polygon[j].x - polygon[i].x) * (point.y - polygon[i].y)) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
            inside = !inside;
        }
    }
    return inside;
}

export function generateShapePath(mode, start, end) {
    const path = [];
    if (mode === 'square') {
        path.push({x: start.x, y: start.y});
        path.push({x: end.x, y: start.y});
        path.push({x: end.x, y: end.y});
        path.push({x: start.x, y: end.y});
    } else if (mode === 'circle') {
        const rx = (end.x - start.x) / 2;
        const ry = (end.y - start.y) / 2;
        const radius = Math.max(Math.abs(rx), Math.abs(ry));
        const cx = start.x + rx;
        const cy = start.y + ry;
        for (let i = 0; i < Math.PI * 2; i += Math.PI / 16) {
            path.push({x: cx + Math.cos(i) * radius, y: cy + Math.sin(i) * radius});
        }
    } else if (mode === 'triangle') {
        path.push({x: start.x + (end.x - start.x) / 2, y: start.y});
        path.push({x: end.x, y: end.y});
        path.push({x: start.x, y: end.y});
    }
    return path;
}