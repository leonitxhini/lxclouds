"""Path-traced glass backdrop for the lxclouds.com hero.

usage: python scene.py <plate|full> <out.png> [scale=0.5] [samples=96]

World units: 1 unit = 100 CSS px. Origin = top centre of the 1440px hero stage.
The frame covers stage x -480..1920 and y -200..900 (2400 x 1100 logical px).
"""
import math
import os
import re
import sys

import bpy
from mathutils import Vector

mode, out = sys.argv[1], sys.argv[2]
scale = float(sys.argv[3]) if len(sys.argv) > 3 else 0.5
samples = int(sys.argv[4]) if len(sys.argv) > 4 else 96

W, H = 2400, 1100
CX, CY = 0.0, -3.5  # frame centre in world units

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ---------- renderer ----------
scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
prefs.compute_device_type = "METAL"
prefs.get_devices()
for d in prefs.devices:
    d.use = d.type == "METAL"
c = scene.cycles
c.device = "GPU"
c.samples = samples
c.use_adaptive_sampling = True
c.adaptive_threshold = 0.01
c.use_denoising = True
c.max_bounces = 32
c.transmission_bounces = 24
c.glossy_bounces = 12
c.diffuse_bounces = 4
c.caustics_refractive = True
c.caustics_reflective = True
c.blur_glossy = 0.3
scene.render.resolution_x = int(W * scale)
scene.render.resolution_y = int(H * scale)
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGB"
scene.render.filepath = os.path.abspath(out)
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "None"
scene.view_settings.exposure = float(os.environ.get("EXPOSURE", "0"))


def hex_rgb(h):
    h = h.lstrip("#")
    srgb = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in srgb)


# ---------- world: studio HDRI, tinted towards lavender ----------
world = bpy.data.worlds.new("world")
scene.world = world
world.use_nodes = True
nt = world.node_tree
bg = nt.nodes["Background"]
env = nt.nodes.new("ShaderNodeTexEnvironment")
studio = os.path.join(bpy.utils.resource_path("LOCAL"), "datafiles", "studiolights", "world", "studio.exr")
env.image = bpy.data.images.load(studio)
tint = nt.nodes.new("ShaderNodeMix")
tint.data_type = "RGBA"
tint.blend_type = "MULTIPLY"
tint.inputs["Factor"].default_value = 1.0
tint.inputs[7].default_value = (0.86, 0.84, 1.0, 1.0)
nt.links.new(env.outputs["Color"], tint.inputs[6])
nt.links.new(tint.outputs[2], bg.inputs["Color"])
bg.inputs["Strength"].default_value = 0.55

# ---------- camera: straight down, orthographic, so stage px map 1:1 ----------
cam_data = bpy.data.cameras.new("cam")
cam_data.type = "ORTHO"
cam_data.ortho_scale = W / 100
cam_data.clip_end = 200
cam = bpy.data.objects.new("cam", cam_data)
cam.location = (CX, CY, 40)
scene.collection.objects.link(cam)
scene.camera = cam


def link(obj):
    scene.collection.objects.link(obj)
    return obj


# ---------- materials ----------
def glass(name, tint=(0.95, 0.94, 1.0), rough=0.0, absorb=0.0, absorb_color="#8f84ff", ior=1.5, shadow=(0.8, 0.78, 0.97), transmission=1.0):
    """Glass that lets light through to the floor: shadow rays see a tinted transparent surface,
    so shadows stay soft and luminous the way they are under real glass."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes, links = m.node_tree.nodes, m.node_tree.links
    b = nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*tint, 1)
    b.inputs["Transmission Weight"].default_value = transmission
    b.inputs["Roughness"].default_value = rough
    b.inputs["IOR"].default_value = ior
    outp = nodes["Material Output"]
    path = nodes.new("ShaderNodeLightPath")
    clear_ = nodes.new("ShaderNodeBsdfTransparent")
    clear_.inputs["Color"].default_value = (*shadow, 1)
    mix = nodes.new("ShaderNodeMixShader")
    links.new(path.outputs["Is Shadow Ray"], mix.inputs["Fac"])
    links.new(b.outputs["BSDF"], mix.inputs[1])
    links.new(clear_.outputs["BSDF"], mix.inputs[2])
    links.new(mix.outputs["Shader"], outp.inputs["Surface"])
    if absorb:
        vol = nodes.new("ShaderNodeVolumeAbsorption")
        vol.inputs["Color"].default_value = (*hex_rgb(absorb_color), 1)
        vol.inputs["Density"].default_value = absorb
        links.new(vol.outputs["Volume"], outp.inputs["Volume"])
    return m


def flat(name, color, rough=0.6, emission=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*hex_rgb(color), 1)
    b.inputs["Roughness"].default_value = rough
    if emission:
        b.inputs["Emission Color"].default_value = (*hex_rgb(color), 1)
        b.inputs["Emission Strength"].default_value = emission
    return m


# ---------- floor: lavender paper, lighter in the middle ----------
bpy.ops.mesh.primitive_plane_add(size=120, location=(0, CY, 0))
floor = bpy.context.object
fm = bpy.data.materials.new("floor")
fm.use_nodes = True
fn = fm.node_tree
fb = fn.nodes["Principled BSDF"]
fb.inputs["Roughness"].default_value = 0.55
fb.inputs["Specular IOR Level"].default_value = 0.25
coord = fn.nodes.new("ShaderNodeTexCoord")
sep = fn.nodes.new("ShaderNodeSeparateXYZ")
ab = fn.nodes.new("ShaderNodeMath")
ab.operation = "ABSOLUTE"
rng = fn.nodes.new("ShaderNodeMapRange")
rng.inputs["From Min"].default_value = 2.5
rng.inputs["From Max"].default_value = 11.0
ramp = fn.nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.interpolation = "EASE"
ramp.color_ramp.elements[0].color = (*hex_rgb("#F7F5FF"), 1)
ramp.color_ramp.elements[1].color = (*hex_rgb("#DDD8FF"), 1)
fn.links.new(coord.outputs["Object"], sep.inputs[0])
fn.links.new(sep.outputs["X"], ab.inputs[0])
fn.links.new(ab.outputs[0], rng.inputs["Value"])
fn.links.new(rng.outputs["Result"], ramp.inputs["Fac"])
fn.links.new(ramp.outputs["Color"], fb.inputs["Base Color"])
floor.data.materials.append(fm)

# ---------- helpers: stage px -> world ----------
def wx(px):
    return (px - 720) / 100


def wy(py):
    return -py / 100


plate_glass = glass("plate", tint=(0.975, 0.97, 1.0), absorb=0.36, shadow=(0.8, 0.78, 0.97))
frost = glass("frost", tint=(1.0, 1.0, 1.0), rough=0.14, ior=1.2, shadow=(0.95, 0.94, 1.0), transmission=0.72)

# ---------- spheres ----------
spheres = []
for name, px, py, r, lift in [
    ("a", 202, 176, 23, 0.55),
    ("b", 346, 436, 20, 0.5),
    ("c", 1350, 238, 52, 0.75),
    ("d", 1357, 11, 13, 0.4),
]:
    R = r / 100
    bpy.ops.mesh.primitive_uv_sphere_add(segments=160, ring_count=80, radius=R, location=(wx(px), wy(py), R + lift))
    o = bpy.context.object
    o.name = f"sphere_{name}"
    bpy.ops.object.shade_smooth()
    # the same tint through every sphere, whatever its size
    o.data.materials.append(glass(f"clear_{name}", absorb=0.13 / R, absorb_color="#7a6dff", ior=1.52, shadow=(0.7, 0.67, 0.96)))
    spheres.append(o)

# ---------- slabs: thick rounded glass plates ----------
def slab(name, px, py, size, rot, z):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(wx(px), wy(py), z))
    o = bpy.context.object
    o.name = name
    o.scale = (size[0] / 100, size[1] / 100, size[2] / 100)
    o.rotation_euler = rot
    bpy.ops.object.transform_apply(scale=True)
    bev = o.modifiers.new("bevel", "BEVEL")
    bev.width = 0.085
    bev.segments = 14
    bev.limit_method = "ANGLE"
    bpy.ops.object.shade_smooth()
    o.data.materials.append(plate_glass)
    return o


slab("slab_1", 118, 236, (150, 132, 24), (0.62, -0.5, 0.34), 1.25)
slab("slab_2", 132, 540, (204, 240, 28), (0.86, 0.12, -0.56), 1.7)
slab("slab_3", 1262, 548, (208, 200, 28), (0.82, -0.1, 0.42), 1.6)

# ---------- ribbons: wide, softly twisted bands of frosted glass ----------
def ribbon(name, pts, width, tilts, mat=frost):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.resolution_u = 64
    cu.extrude = width / 2
    cu.bevel_depth = 0.022
    cu.bevel_resolution = 6
    cu.twist_smooth = 8
    sp = cu.splines.new("BEZIER")
    sp.bezier_points.add(len(pts) - 1)
    for bp, p, t in zip(sp.bezier_points, pts, tilts):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = "AUTO"
        bp.tilt = math.radians(t)
    o = link(bpy.data.objects.new(name, cu))
    o.data.materials.append(mat)
    for poly in []:
        pass
    return o


ribbon("rib_l1", [(-13.5, 0.2, 0.5), (-8.6, -0.9, 0.7), (-4.5, -2.9, 0.45), (-3.5, -5.6, 0.7), (-5.8, -8.0, 0.45), (-10, -10.4, 0.6)], 1.9, [90, 80, 98, 84, 96, 90])
ribbon("rib_l2", [(-13.5, 2.6, 0.3), (-9.6, 1.5, 0.42), (-6.2, 1.7, 0.3), (-3.6, 3.4, 0.42)], 1.2, [92, 96, 88, 91])
ribbon("rib_r1", [(13.5, 0.0, 0.5), (8.8, -1.1, 0.7), (4.7, -3.1, 0.45), (3.7, -5.8, 0.7), (6.1, -8.2, 0.45), (10.4, -10.4, 0.6)], 1.9, [90, 100, 82, 96, 84, 90])
ribbon("rib_r2", [(13.5, 2.4, 0.3), (9.8, 1.3, 0.42), (6.4, 1.6, 0.3), (3.8, 3.4, 0.42)], 1.2, [88, 84, 92, 89])

# ---------- orbit lines and ring markers on the floor (same paths as the SVG artwork) ----------
ORBITS = [
    "M268 62C330 20 520 40 610 138",
    "M214 148C150 260 320 330 492 292",
    "M440 470C520 430 580 410 630 398",
    "M1058 110C1110 40 1300 10 1372 50",
    "M1142 288C1220 250 1290 236 1328 230",
    "M1040 470C1180 420 1330 470 1262 560",
]
RINGS = [(426, 72), (492, 292), (1186, 72), (1142, 288)]


def art(x, y, z=0.012):  # 1640x760 artboard, offset (-100,-40) from the stage
    return Vector(((x - 820) / 100, -(y - 40) / 100, z))


line_mat = flat("line", "#A39CFF", rough=0.5)
for i, d in enumerate(ORBITS):
    n = [float(v) for v in re.findall(r"-?\d+\.?\d*", d)]
    cu = bpy.data.curves.new(f"orbit_{i}", "CURVE")
    cu.dimensions = "3D"
    cu.resolution_u = 48
    cu.bevel_depth = 0.0065
    cu.bevel_resolution = 3
    sp = cu.splines.new("BEZIER")
    segs = (len(n) - 2) // 6
    sp.bezier_points.add(segs)
    pts = sp.bezier_points
    pts[0].co = art(n[0], n[1])
    pts[0].handle_left = pts[0].co
    for s in range(segs):
        c1, c2, p = art(n[2 + s * 6], n[3 + s * 6]), art(n[4 + s * 6], n[5 + s * 6]), art(n[6 + s * 6], n[7 + s * 6])
        pts[s].handle_right = c1
        pts[s + 1].handle_left = c2
        pts[s + 1].co = p
        pts[s + 1].handle_right = p
    for p in pts:
        p.handle_left_type = p.handle_right_type = "FREE"
    link(bpy.data.objects.new(f"orbit_{i}", cu)).data.materials.append(line_mat)

ring_mat = flat("ring", "#7C79FF", rough=0.4)
dot_mat = flat("dot", "#F6F4FF", rough=0.5)
for x, y in RINGS:
    p = art(x, y, 0.02)
    bpy.ops.mesh.primitive_torus_add(location=p, major_radius=0.05, minor_radius=0.014, major_segments=48, minor_segments=12)
    bpy.context.object.data.materials.append(ring_mat)
    bpy.ops.object.shade_smooth()
    bpy.ops.mesh.primitive_cylinder_add(location=(p.x, p.y, 0.012), radius=0.045, depth=0.012, vertices=48)
    bpy.context.object.data.materials.append(dot_mat)

# ---------- lights ----------
def area(name, loc, target, size, power, color=(1, 1, 1), caustics=False, shape="RECTANGLE", size_y=None):
    ld = bpy.data.lights.new(name, "AREA")
    ld.shape = shape
    ld.size = size
    if size_y:
        ld.size_y = size_y
    ld.energy = power
    ld.color = color
    ld.cycles.is_caustics_light = caustics
    o = link(bpy.data.objects.new(name, ld))
    o.location = loc
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return o


area("key", (-9, 7, 16), (0, -3.5, 0), 9, 62000, size_y=6)
area("fill", (7, -13, 15), (0, -4.5, 0), 14, 34000, color=(0.92, 0.9, 1.0), size_y=10)
area("rim", (9, -13, 5), (2, -4, 0.6), 6, 9000, color=(0.5, 0.44, 1.0), size_y=3)

# ---------- passes ----------
if mode == "plate":
    # spheres leave the picture but keep their shadows and caustics on the floor
    for o in spheres:
        o.visible_camera = False

if mode.startswith("sphere:"):
    # only the square around one sphere, so it can be rendered at a much higher resolution
    o = next(o for o in spheres if o.name == "sphere_" + mode.split(":")[1])
    R = o.dimensions.x / 2
    pad = 0.04
    x0 = (o.location.x - R - pad - (CX - W / 200)) / (W / 100)
    x1 = (o.location.x + R + pad - (CX - W / 200)) / (W / 100)
    y0 = (o.location.y - R - pad - (CY - H / 200)) / (H / 100)
    y1 = (o.location.y + R + pad - (CY - H / 200)) / (H / 100)
    scene.render.use_border = True
    scene.render.use_crop_to_border = True
    scene.render.border_min_x, scene.render.border_max_x = x0, x1
    scene.render.border_min_y, scene.render.border_max_y = y0, y1

bpy.ops.render.render(write_still=True)
print("rendered", mode, scene.render.resolution_x, scene.render.resolution_y, "->", scene.render.filepath)
