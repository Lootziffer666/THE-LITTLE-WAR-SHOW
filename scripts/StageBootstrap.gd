extends Node3D

## Build-in-Code-Wurzel von "The Little War Show" (Konventionen §3).
## Die gesamte Bühne wird zur Laufzeit hier aufgebaut.
##
## Schritt 01: leeres Bühnen-Diorama (Boden, Rückwand, Proszenium mit Vorhängen,
## Flies-Bar) + PROVISORISCHE Kamera/Licht (werden in Schritt 02 ersetzt).
## Knotennamen sind verbindlich (Konventionen §12).

# --- Bühnenmaße (tunebar) ---
@export_group("Stage")
@export var stage_width: float = 8.0     # X-Ausdehnung des Bodens
@export var stage_depth: float = 5.0      # Z-Ausdehnung des Bodens
@export var floor_thickness: float = 0.2
@export var backdrop_z: float = -2.5      # Rückwand upstage
@export var backdrop_height: float = 4.2

@export_group("Proscenium")
@export var curtain_height: float = 4.2
@export var curtain_width: float = 0.7
@export var valance_height: float = 0.7   # oberer Vorhang-Volant
@export var flies_bar_y: float = 3.7      # Aufhängung für Schnüre/Props (Schritt 04/07)

@export_group("Provisional camera/light (replaced in step 02)")
@export var cam_position: Vector3 = Vector3(0.0, 3.2, 6.5)
@export var cam_pitch_deg: float = -22.0
@export var cam_fov: float = 45.0

# --- Farben (stimmig zu reference/1781315900594.png) ---
const COL_WOOD := Color(0.36, 0.24, 0.13)
const COL_CURTAIN := Color(0.45, 0.05, 0.06)
const COL_BACKDROP := Color(0.08, 0.07, 0.10)
const COL_BAR := Color(0.05, 0.05, 0.06)


func _ready() -> void:
	_build_world()
	_build_provisional_camera_and_light()
	print("stage ready")


func _build_world() -> void:
	var world := Node3D.new()
	world.name = "World"
	add_child(world)

	# Boden: Oberkante exakt bei y = 0 (Figuren stehen auf y = 0).
	var floor_mat := _make_material(COL_WOOD, 0.85, 0.0)
	var stage_floor := _make_box(
		"StageFloor",
		Vector3(stage_width, floor_thickness, stage_depth),
		Vector3(0.0, -floor_thickness * 0.5, 0.0),
		floor_mat
	)
	world.add_child(stage_floor)

	# Rückwand (Projektionsfläche für Schritt 08): hohe Quad upstage.
	var backdrop_mat := _make_material(COL_BACKDROP, 0.95, 0.0)
	var backdrop := _make_quad(
		"BackdropScreen",
		Vector2(stage_width, backdrop_height),
		Vector3(0.0, backdrop_height * 0.5, backdrop_z),
		backdrop_mat
	)
	world.add_child(backdrop)

	world.add_child(_build_proscenium())


func _build_proscenium() -> Node3D:
	var frame := Node3D.new()
	frame.name = "ProsceniumFrame"

	var curtain_mat := _make_material(COL_CURTAIN, 0.9, 0.0)
	var half_w := stage_width * 0.5
	var half_d := stage_depth * 0.5

	# Seitenvorhänge: schmale hohe Boxen an den Bühnenkanten, leicht downstage.
	var left := _make_box(
		"CurtainLeft",
		Vector3(curtain_width, curtain_height, stage_depth),
		Vector3(-half_w + curtain_width * 0.5, curtain_height * 0.5, 0.0),
		curtain_mat
	)
	frame.add_child(left)

	var right := _make_box(
		"CurtainRight",
		Vector3(curtain_width, curtain_height, stage_depth),
		Vector3(half_w - curtain_width * 0.5, curtain_height * 0.5, 0.0),
		curtain_mat
	)
	frame.add_child(right)

	# Oberer Volant: breite flache Box über der Bühnenöffnung.
	var top := _make_box(
		"CurtainTop",
		Vector3(stage_width, valance_height, curtain_width),
		Vector3(0.0, curtain_height - valance_height * 0.5, half_d),
		curtain_mat
	)
	frame.add_child(top)

	# Flies-Bar: dünne horizontale Stange über der Bühne (Verankerung später).
	var bar_mat := _make_material(COL_BAR, 0.6, 0.4)
	var bar := _make_box(
		"FliesBar",
		Vector3(stage_width * 0.95, 0.08, 0.08),
		Vector3(0.0, flies_bar_y, 0.0),
		bar_mat
	)
	bar.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	frame.add_child(bar)

	return frame


func _build_provisional_camera_and_light() -> void:
	# PROVISORISCH — wird in Schritt 02 durch finalen Lighting-/Kamera-Aufbau ersetzt.
	var cam := Camera3D.new()
	cam.name = "ProvisionalCamera"
	cam.projection = Camera3D.PROJECTION_PERSPECTIVE
	cam.fov = cam_fov
	cam.position = cam_position
	cam.rotation_degrees = Vector3(cam_pitch_deg, 0.0, 0.0)
	cam.current = true
	add_child(cam)

	var sun := DirectionalLight3D.new()
	sun.name = "ProvisionalLight"
	sun.rotation_degrees = Vector3(-50.0, -30.0, 0.0)
	sun.light_energy = 1.1
	sun.shadow_enabled = true
	add_child(sun)


# --- Bau-Helfer ---

func _make_material(color: Color, roughness: float, metallic: float) -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = roughness
	mat.metallic = metallic
	return mat


func _make_box(node_name: String, size: Vector3, pos: Vector3, mat: Material) -> MeshInstance3D:
	var mesh := BoxMesh.new()
	mesh.size = size
	var mi := MeshInstance3D.new()
	mi.name = node_name
	mi.mesh = mesh
	mi.material_override = mat
	mi.position = pos
	return mi


func _make_quad(node_name: String, size: Vector2, pos: Vector3, mat: Material) -> MeshInstance3D:
	var mesh := QuadMesh.new()
	mesh.size = size
	var mi := MeshInstance3D.new()
	mi.name = node_name
	mi.mesh = mesh
	mi.material_override = mat
	mi.position = pos
	return mi
