extends Node3D

## Build-in-Code-Wurzel von "The Little War Show" (Konventionen §3).
## Die gesamte Bühne wird zur Laufzeit hier aufgebaut.
##
## Schritt 01: erhöhtes Bühnen-Diorama (Boden + Apron, Rückwand, Proszenium, Flies-Bar).
## Schritt 02: finaler HD-2D-Theater-Look — Key-Spot mit Schatten, warmes Fill,
## Footlights (mit blühenden Glühbirnen), WorldEnvironment (Glow/Filmic/Adjustments)
## und Diorama-Kamera mit dezentem Tilt-Shift-DoF.
## Knotennamen sind verbindlich (Konventionen §12).

# --- Bühnenmaße (tunebar) ---
@export_group("Stage")
@export var stage_width: float = 8.0
@export var stage_depth: float = 5.0
@export var floor_thickness: float = 0.2
@export var apron_height: float = 0.9
@export var backdrop_z: float = -2.5
@export var backdrop_height: float = 4.2

@export_group("Proscenium")
@export var curtain_height: float = 4.2
@export var curtain_width: float = 0.7
@export var valance_height: float = 0.7
@export var flies_bar_y: float = 3.7

@export_group("Camera")
@export var cam_position: Vector3 = Vector3(0.0, 3.0, 6.8)
@export var cam_pitch_deg: float = -20.0
@export var cam_fov: float = 45.0
@export var dof_near_distance: float = 5.5   # näher als das blurrt (Apron-Vordergrund)
@export var dof_far_distance: float = 8.0     # weiter als das blurrt (Backdrop)
@export var dof_transition: float = 1.2
@export var dof_amount: float = 0.08          # dezent halten (sonst "matschig")

@export_group("Lighting")
@export var key_position: Vector3 = Vector3(1.8, 5.5, 3.8)
@export var key_energy: float = 4.0
@export var fill_energy: float = 0.5
@export var footlight_energy: float = 1.4
@export var footlight_emission: float = 5.0   # treibt die Birnen über die Glow-Schwelle

@export_group("Environment")
@export var ambient_energy: float = 0.18
@export var glow_intensity: float = 0.8
@export var glow_threshold: float = 0.95       # hoch → nur die hellen Birnen blühen

# --- Farben ---
const COL_WOOD := Color(0.40, 0.26, 0.14)
const COL_APRON := Color(0.20, 0.13, 0.07)
const COL_CURTAIN := Color(0.45, 0.05, 0.06)
const COL_BACKDROP := Color(0.11, 0.08, 0.10)
const COL_BAR := Color(0.05, 0.05, 0.06)
const COL_KEY := Color(1.0, 0.95, 0.85)        # warmweißes Schlüssellicht
const COL_FILL := Color(1.0, 0.85, 0.70)       # warmes Aufhelllicht
const COL_FOOT := Color(1.0, 0.70, 0.40)       # warmes Footlight-Orange
const COL_BG := Color(0.02, 0.02, 0.03)        # fast schwarzer Bühnenraum
const COL_AMBIENT := Color(0.15, 0.13, 0.16)

const FOOTLIGHT_COUNT := 3


func _ready() -> void:
	_build_world()
	_build_lighting()
	_build_environment()
	_build_camera()
	print("stage ready")


func _build_world() -> void:
	var world := Node3D.new()
	world.name = "World"
	add_child(world)

	var half_d := stage_depth * 0.5

	world.add_child(_make_box(
		"StageFloor",
		Vector3(stage_width, floor_thickness, stage_depth),
		Vector3(0.0, -floor_thickness * 0.5, 0.0),
		_make_material(COL_WOOD, 0.85, 0.0)
	))

	var apron := _make_box(
		"StageApron",
		Vector3(stage_width, apron_height, 0.15),
		Vector3(0.0, -apron_height * 0.5, half_d + 0.075),
		_make_material(COL_APRON, 0.9, 0.0)
	)
	apron.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	world.add_child(apron)

	world.add_child(_make_quad(
		"BackdropScreen",
		Vector2(stage_width, backdrop_height),
		Vector3(0.0, backdrop_height * 0.5, backdrop_z),
		_make_material(COL_BACKDROP, 0.95, 0.0)
	))

	world.add_child(_build_proscenium())


func _build_proscenium() -> Node3D:
	var frame := Node3D.new()
	frame.name = "ProsceniumFrame"

	var curtain_mat := _make_material(COL_CURTAIN, 0.9, 0.0)
	var half_w := stage_width * 0.5
	var half_d := stage_depth * 0.5

	frame.add_child(_make_box(
		"CurtainLeft",
		Vector3(curtain_width, curtain_height, stage_depth),
		Vector3(-half_w + curtain_width * 0.5, curtain_height * 0.5, 0.0),
		curtain_mat
	))
	frame.add_child(_make_box(
		"CurtainRight",
		Vector3(curtain_width, curtain_height, stage_depth),
		Vector3(half_w - curtain_width * 0.5, curtain_height * 0.5, 0.0),
		curtain_mat
	))
	frame.add_child(_make_box(
		"CurtainTop",
		Vector3(stage_width, valance_height, curtain_width),
		Vector3(0.0, curtain_height - valance_height * 0.5, half_d - curtain_width * 0.5),
		curtain_mat
	))

	var bar := _make_box(
		"FliesBar",
		Vector3(stage_width * 0.95, 0.08, 0.08),
		Vector3(0.0, flies_bar_y, 0.0),
		_make_material(COL_BAR, 0.6, 0.4)
	)
	bar.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	frame.add_child(bar)

	return frame


func _build_lighting() -> void:
	var lighting := Node3D.new()
	lighting.name = "Lighting"
	add_child(lighting)

	# Key-Spot: erzeugt den weichen Schlagschatten des Performers.
	var key := SpotLight3D.new()
	key.name = "KeySpot"
	key.position = key_position
	key.light_color = COL_KEY
	key.light_energy = key_energy
	key.spot_range = 18.0
	key.spot_angle = 38.0
	key.spot_angle_attenuation = 1.2
	key.shadow_enabled = true
	lighting.add_child(key)
	key.look_at(Vector3(0.0, 0.9, 0.0), Vector3.UP)  # auf die Bühnenmitte zielen

	# Warmes Fill: hebt die Schatten an, wirft selbst keinen Schatten.
	var fill := DirectionalLight3D.new()
	fill.name = "WarmFill"
	fill.rotation_degrees = Vector3(-35.0, 18.0, 0.0)
	fill.light_color = COL_FILL
	fill.light_energy = fill_energy
	fill.shadow_enabled = false
	lighting.add_child(fill)

	# Footlights: warme Punkte an der Bühnenkante; sichtbare Birnen sind die Bloom-Quelle.
	var footlights := Node3D.new()
	footlights.name = "Footlights"
	lighting.add_child(footlights)

	var bulb_mat := _make_emissive(COL_FOOT, footlight_emission)
	var span := stage_width - 1.6
	for i in FOOTLIGHT_COUNT:
		var t := float(i) / float(FOOTLIGHT_COUNT - 1) - 0.5  # -0.5 … 0.5
		var fx := Node3D.new()
		fx.name = "Footlight%d" % i
		fx.position = Vector3(t * span, 0.18, stage_depth * 0.5 - 0.25)
		footlights.add_child(fx)

		var bulb := _make_sphere("Bulb", 0.09, Vector3.ZERO, bulb_mat)
		bulb.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		fx.add_child(bulb)

		var omni := OmniLight3D.new()
		omni.name = "Light"
		omni.light_color = COL_FOOT
		omni.light_energy = footlight_energy
		omni.omni_range = 3.2
		omni.shadow_enabled = false
		fx.add_child(omni)


func _build_environment() -> void:
	var env := Environment.new()
	# Hintergrund + Ambient: dunkler Bühnenraum.
	env.background_mode = Environment.BG_COLOR
	env.background_color = COL_BG
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = COL_AMBIENT
	env.ambient_light_energy = ambient_energy

	# Glow/Bloom: hohe Schwelle → nur die hellen Footlight-Birnen blühen.
	env.glow_enabled = true
	env.glow_intensity = glow_intensity
	env.glow_strength = 1.0
	env.glow_bloom = 0.1
	env.glow_blend_mode = Environment.GLOW_BLEND_MODE_ADDITIVE
	env.glow_hdr_threshold = glow_threshold
	env.set_glow_level(4, 1.0)
	env.set_glow_level(5, 1.0)

	# Verarbeitungsreihenfolge: DoF (Kamera) → Glow → Tonemap → Adjustments.
	env.tonemap_mode = Environment.TONE_MAPPER_FILMIC
	env.tonemap_exposure = 1.0

	env.adjustment_enabled = true
	env.adjustment_brightness = 1.0
	env.adjustment_contrast = 1.08
	env.adjustment_saturation = 1.12

	var we := WorldEnvironment.new()
	we.name = "WorldEnvironment"
	we.environment = env
	add_child(we)


func _build_camera() -> void:
	var cam := Camera3D.new()
	cam.name = "StageCamera"
	cam.projection = Camera3D.PROJECTION_PERSPECTIVE
	cam.fov = cam_fov
	cam.position = cam_position
	cam.rotation_degrees = Vector3(cam_pitch_deg, 0.0, 0.0)
	cam.current = true

	# Tilt-Shift-Miniatur: schmales Schärfeband auf der Bühnenmitte.
	var attrs := CameraAttributesPractical.new()
	attrs.dof_blur_far_enabled = true
	attrs.dof_blur_far_distance = dof_far_distance
	attrs.dof_blur_far_transition = dof_transition
	attrs.dof_blur_near_enabled = true
	attrs.dof_blur_near_distance = dof_near_distance
	attrs.dof_blur_near_transition = dof_transition
	attrs.dof_blur_amount = dof_amount
	cam.attributes = attrs

	add_child(cam)


# --- Bau-Helfer ---

func _make_material(color: Color, roughness: float, metallic: float) -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = roughness
	mat.metallic = metallic
	return mat


func _make_emissive(color: Color, energy: float) -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mat.emission_enabled = true
	mat.emission = color
	mat.emission_energy_multiplier = energy
	return mat


func _make_box(node_name: String, size: Vector3, pos: Vector3, mat: Material) -> MeshInstance3D:
	var mesh := BoxMesh.new()
	mesh.size = size
	return _make_mesh_instance(node_name, mesh, pos, mat)


func _make_quad(node_name: String, size: Vector2, pos: Vector3, mat: Material) -> MeshInstance3D:
	var mesh := QuadMesh.new()
	mesh.size = size
	return _make_mesh_instance(node_name, mesh, pos, mat)


func _make_sphere(node_name: String, radius: float, pos: Vector3, mat: Material) -> MeshInstance3D:
	var mesh := SphereMesh.new()
	mesh.radius = radius
	mesh.height = radius * 2.0
	return _make_mesh_instance(node_name, mesh, pos, mat)


func _make_mesh_instance(node_name: String, mesh: Mesh, pos: Vector3, mat: Material) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	mi.name = node_name
	mi.mesh = mesh
	mi.material_override = mat
	mi.position = pos
	return mi
