extends Node3D

## Build-in-Code-Wurzel von "The Little War Show" (Konventionen §3).
## Die gesamte Bühne wird zur Laufzeit hier aufgebaut.
##
## Schritt 01: leeres Bühnen-Diorama als erhöhte Theaterbühne — Boden + Schürze
## (Apron), bemalte Rückwand, kohärenter Proszenium-Rahmen (Seitenvorhänge bündig
## mit dem Volant) und Flies-Bar. Kamera/Licht sind PROVISORISCH (Schritt 02 ersetzt
## sie). Knotennamen sind verbindlich (Konventionen §12).

# --- Bühnenmaße (tunebar) ---
@export_group("Stage")
@export var stage_width: float = 8.0      # X-Ausdehnung des Bodens
@export var stage_depth: float = 5.0       # Z-Ausdehnung des Bodens
@export var floor_thickness: float = 0.2
@export var apron_height: float = 0.9      # sichtbare Schürze: Bühne wirkt erhöht
@export var backdrop_z: float = -2.5       # Rückwand upstage
@export var backdrop_height: float = 4.2

@export_group("Proscenium")
@export var curtain_height: float = 4.2
@export var curtain_width: float = 0.7
@export var valance_height: float = 0.7    # oberer Vorhang-Volant
@export var flies_bar_y: float = 3.7       # Aufhängung für Schnüre/Props (Schritt 04/07)

@export_group("Provisional camera/light (replaced in step 02)")
@export var cam_position: Vector3 = Vector3(0.0, 3.0, 6.8)
@export var cam_pitch_deg: float = -20.0
@export var cam_fov: float = 45.0

# --- Farben (stimmig zu reference/1781315900594.png) ---
const COL_WOOD := Color(0.40, 0.26, 0.14)       # warmer Bühnenboden
const COL_APRON := Color(0.20, 0.13, 0.07)      # dunkler Schürzen-Holzton
const COL_CURTAIN := Color(0.45, 0.05, 0.06)    # tiefes Theaterrot
const COL_BACKDROP := Color(0.11, 0.08, 0.10)   # dunkler, leicht warmer "bemalter" Hintergrund
const COL_BAR := Color(0.05, 0.05, 0.06)


func _ready() -> void:
	_build_world()
	_build_provisional_camera_and_light()
	print("stage ready")


func _build_world() -> void:
	var world := Node3D.new()
	world.name = "World"
	add_child(world)

	var half_d := stage_depth * 0.5

	# Boden: Oberkante exakt bei y = 0 (Figuren stehen auf y = 0).
	world.add_child(_make_box(
		"StageFloor",
		Vector3(stage_width, floor_thickness, stage_depth),
		Vector3(0.0, -floor_thickness * 0.5, 0.0),
		_make_material(COL_WOOD, 0.85, 0.0)
	))

	# Schürze (Apron): sichtbare Front unter der Bodenvorderkante → Bühne wirkt erhöht.
	var apron := _make_box(
		"StageApron",
		Vector3(stage_width, apron_height, 0.15),
		Vector3(0.0, -apron_height * 0.5, half_d + 0.075),
		_make_material(COL_APRON, 0.9, 0.0)
	)
	apron.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	world.add_child(apron)

	# Rückwand (Projektionsfläche für Schritt 08): hohe Quad upstage.
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
	# Gemeinsame Rahmen-Frontebene: Vorderflächen von Beinen UND Volant liegen bei z = half_d.

	# Seitenvorhänge: hohe Boxen über die volle Tiefe (maskieren die Seiten),
	# Vorderfläche bündig bei z = half_d.
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

	# Oberer Volant: breite Box, Vorderfläche bündig zur Frontebene (kein Überstand).
	frame.add_child(_make_box(
		"CurtainTop",
		Vector3(stage_width, valance_height, curtain_width),
		Vector3(0.0, curtain_height - valance_height * 0.5, half_d - curtain_width * 0.5),
		curtain_mat
	))

	# Flies-Bar: dünne horizontale Stange über der Bühne (Verankerung später).
	var bar := _make_box(
		"FliesBar",
		Vector3(stage_width * 0.95, 0.08, 0.08),
		Vector3(0.0, flies_bar_y, 0.0),
		_make_material(COL_BAR, 0.6, 0.4)
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
	return _make_mesh_instance(node_name, mesh, pos, mat)


func _make_quad(node_name: String, size: Vector2, pos: Vector3, mat: Material) -> MeshInstance3D:
	var mesh := QuadMesh.new()
	mesh.size = size
	return _make_mesh_instance(node_name, mesh, pos, mat)


func _make_mesh_instance(node_name: String, mesh: Mesh, pos: Vector3, mat: Material) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	mi.name = node_name
	mi.mesh = mesh
	mi.material_override = mat
	mi.position = pos
	return mi
