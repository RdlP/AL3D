import os
import sys, getopt
from shutil import copy
from subprocess import call

try:
    from jsmin import jsmin                     
except ImportError:
	print "jsmin doesn't installed. This script need it to minify the output file"

source_dir = "src"
files =["ALMath/Vector2.js","ALMath/Vector3.js","ALMath/Vector4.js","ALMath/Quaternion.js","ALMath/Matrix3.js","ALMath/Matrix4.js","AL3D/Renderer.js", "AL3D/Postprocessing.js", "AL3D/Scene.js", "AL3D/LinearFog.js","AL3D/ExpFog.js","AL3D/Exp2Fog.js","AL3D/Object3D.js","AL3D/SkyBox.js","AL3D/Mesh.js","AL3D/Camera.js","AL3D/PerspectiveCamera.js","AL3D/OrthographicCamera.js","AL3D/Picker.js","AL3D/Light.js","AL3D/AmbientLight.js","AL3D/DirectionalLight.js","AL3D/PointLight.js","AL3D/SpotLight.js","AL3D/Material.js","AL3D/BasicMaterial.js","AL3D/LambertMaterial.js","AL3D/PhongMaterial.js","AL3D/BlinnMaterial.js","AL3D/ToonMaterial.js","AL3D/Texture.js","AL3D/TextureManager.js","AL3D/ShaderManager.js", "AL3D/Utils.js"]
source_code = ""
build_directory = "dist"
move_source_to = ""
output_doc_dir = "./doc"
al3d_name = "AL3D"
SUCESS_COLOR = "\x1b[32m"
FAIL_COLOR = "\x1b[31m"
DEFAULT_COLOR = "\x1b[0m"

def join():
	global source_code, al3d_name, al3d_output
	print "check if files exist in " + source_dir + " directory..."

	for file in files:
		f = os.path.join(source_dir, file)
		if (os.path.exists(build_directory)==True):
			#print f + '\t\t\t' + '[OK]'
			print ("{0:40}"+SUCESS_COLOR+"[OK]"+DEFAULT_COLOR).format(f)
		else:
			#print f + '\t\t\t' + '[FAIL]'
			print ("{0:40}"+SUCESS_COLOR+"[FAIL]"+DEFAULT_COLOR).format(f)
			sys.exit()

	print "joining files..."
	for file in files:
		f = open(os.path.join(source_dir, file),"r")
		source_code = source_code + '\n\n' + f.read()
		f.close()

	if not os.path.exists(build_directory):
		os.makedirs(build_directory)

	print "Output file: " + al3d_name + ".js and " + al3d_name + ".min.js"
	al3d_output = os.path.join(build_directory, al3d_name)

	output_file = open(al3d_output + ".js", "w")
	output_file.write(source_code)
	output_file.close()

def minify():
	output_file = open(al3d_output + ".js", "r")
	minified_al3d = jsmin(output_file.read(), quote_chars="'\"`")

	output_minified_al3d = open(al3d_output +".min.js", "w")
	output_minified_al3d.write(minified_al3d)
	output_minified_al3d.close()

def generateDoc():
	global source_code, al3d_name, al3d_output,output_doc_dir
	print "generating doc..."
	result = call(["jsdoc","--verbose", "-d", output_doc_dir, "--readme", "README.md", al3d_output+".js"])
	if result != 0:
		print FAIL_COLOR + "Error generating doc" + DEFAULT_COLOR
	else:
		print SUCESS_COLOR + "doc generated in " + os.path.abspath(output_doc_dir) + "!" + DEFAULT_COLOR
def usage():
	print "program to build AL3D.js and ALMath.js. The basic usage is python build.py without arguments, the output will be a dist directory with AL3D.js and AL3D.min.js that contains all clases from AL3D.js and ALMath.js"
	print "Additionally you can use the following command:"
	print " - generate doc: to generate a doc directory with the documentation of AL3D.js."
	print " - move_source_to= to copy AL3D.js and AL3D.min.js from dist directory to a directory indicated."
	print " - output_doc_dir= to change the default doc directory name."

def move_to(move_source_to):
	global source_code, al3d_name, al3d_output
	if (os.path.isabs(move_source_to)):
		print SUCESS_COLOR + "moving source files to: " + os.path.abspath(move_source_to) + DEFAULT_COLOR
		copy(os.path.abspath(al3d_output+ ".js"), os.path.abspath(move_source_to))
		copy(os.path.abspath(al3d_output+ ".min.js"), os.path.abspath(move_source_to))
	else:
		new_path = os.path.join(build_directory, move_source_to)
		print SUCESS_COLOR + "moving source files to: " + os.path.abspath(new_path) + DEFAULT_COLOR
		copy(os.path.abspath(al3d_output+ ".js"), os.path.abspath(new_path))
		copy(os.path.abspath(al3d_output+ ".min.js"), os.path.abspath(new_path))


def main():
	global move_source_to
	try:
		opts, args = getopt.getopt(sys.argv[1:], "", ["help", "generate_doc", "move_source_to=", "output_doc_dir="])
	except getopt.GetoptError as err:
		print str(err)
		usage()
		sys.exit(2)
	output = None
	verbose = False
	generate_doc = False
	for o, a in opts:
		if o == "--generate_doc":
			generate_doc = True
		elif o in "--move_source_to":
			move_source_to = a
		elif o in "--output_doc_dir":
			output_doc_dir = a
		elif o == "--help":
			usage()
			sys.exit(2)
		else:
			assert False, "unhandled option"
    # ...
	join()
	minify()
	if (move_source_to != ""):
		move_to(move_source_to)
	if(generate_doc == True):
		generateDoc()

if __name__=="__main__":
	main()