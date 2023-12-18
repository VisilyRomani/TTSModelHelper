// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs::File, io};

fn setup_file() -> Result<(), io::Error> {
    let file_path = "";
    if !File::open(&file_path).is_ok() {
        File::create(&file_path)?;
    }
    Ok(())
}

fn main() {
    let result = setup_file();
    if result.is_err() {
        println!("error in file setup");
    }
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
